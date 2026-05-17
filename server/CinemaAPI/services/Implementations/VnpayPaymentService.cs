using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using StackExchange.Redis;
using Microsoft.AspNetCore.SignalR;
using CinemaAPI.Hubs;

namespace CinemaAPI.Services.Implementations
{
    public class VnpayPaymentService : IVnpayPaymentService
    {
        private readonly AppDbContext _dbContext;
        private readonly VnpayConfig _vnpayConfig;
        private readonly IConnectionMultiplexer _redis;
        private readonly IHubContext<SeatLockHub> _hubContext;

        public VnpayPaymentService(
            AppDbContext dbContext, 
            IOptions<VnpayConfig> vnpayConfig,
            IConnectionMultiplexer redis,
            IHubContext<SeatLockHub> hubContext)
        {
            _dbContext = dbContext;
            _vnpayConfig = vnpayConfig.Value;
            _redis = redis;
            _hubContext = hubContext;
        }

        public async Task<List<VnpayPayment>> GetAllPaymentsAsync() =>
            await _dbContext.VnpayPayments
                .AsNoTracking()
                .Include(p => p.Booking)
                .ThenInclude(b => b.ShowTime)
                .OrderByDescending(p => p.payment_id)
                .ToListAsync();

        public async Task<VnpayPayment?> GetPaymentByIdAsync(int paymentId) =>
            await _dbContext.VnpayPayments
                .AsNoTracking()
                .Include(p => p.Booking)
                .ThenInclude(b => b.ShowTime)
                .FirstOrDefaultAsync(p => p.payment_id == paymentId);

        public async Task<CreateVnpayPaymentResult> CreatePaymentUrlAsync(VnpayPaymentCreateRequest request, string ipAddress)
        {
            var booking = await _dbContext.Bookings.FirstOrDefaultAsync(b => b.booking_id == request.booking_id);
            if (booking == null)
                throw new Exception($"Booking {request.booking_id} not found.");

            if (booking.status != BookingStatus.Pending)
                throw new Exception("Booking is already processed or cancelled. Cannot create payment.");

            if (request.method != VnpayPaymentType.VNPAYQR && request.method != VnpayPaymentType.VNBANK)
                throw new Exception("Unsupported payment method.");

            var amount = request.amount ?? booking.finalAmount;
            if (amount <= 0)
                throw new Exception("Payment amount must be greater than 0.");

            var vnNow = DateTime.UtcNow.AddHours(7);
            var expireAt = vnNow.AddMinutes(5);
            var txnRef = $"B{booking.booking_id}_{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}";

            var payment = new VnpayPayment
            {
                booking_id = booking.booking_id,
                amount = amount,
                method = request.method,
                status = VnpayPaymentStatus.Pending,
                vnp_TxnRef = txnRef,
                vnp_OrderInfo = string.IsNullOrWhiteSpace(request.orderInfo)
                    ? $"Thanh toan booking {booking.booking_id}"
                    : request.orderInfo.Trim(),
                vnp_IpAddr = ipAddress,
                vnp_CreateDate = vnNow,
                vnp_ExpireDate = expireAt
            };

            _dbContext.VnpayPayments.Add(payment);
            await _dbContext.SaveChangesAsync();

            var paymentUrl = BuildPaymentUrl(payment, request.returnUrl, ipAddress);

            return new CreateVnpayPaymentResult
            {
                payment_id = payment.payment_id,
                txnRef = payment.vnp_TxnRef ?? string.Empty,
                paymentUrl = paymentUrl,
                status = payment.status,
                expireAt = payment.vnp_ExpireDate
            };
        }

        public async Task<VnpayPaymentCallbackResult> HandleVnpayCallbackAsync(IReadOnlyDictionary<string, string> queryParams)
        {
            var secureHash = queryParams.TryGetValue("vnp_SecureHash", out var hash) ? hash : string.Empty;
            var txnRef = queryParams.TryGetValue("vnp_TxnRef", out var refValue) ? refValue : string.Empty;
            var responseCode = queryParams.TryGetValue("vnp_ResponseCode", out var code) ? code : string.Empty;

            if (string.IsNullOrWhiteSpace(txnRef))
            {
                return new VnpayPaymentCallbackResult
                {
                    isValidSignature = false,
                    isSuccess = false,
                    txnRef = string.Empty,
                    responseCode = responseCode,
                    message = "Missing txnRef"
                };
            }

            if (!ValidateSignature(queryParams, secureHash))
            {
                return new VnpayPaymentCallbackResult
                {
                    isValidSignature = false,
                    isSuccess = false,
                    txnRef = txnRef,
                    responseCode = responseCode,
                    message = "Invalid signature"
                };
            }

            var payment = await _dbContext.VnpayPayments
                .Include(p => p.Booking)
                .FirstOrDefaultAsync(p => p.vnp_TxnRef == txnRef);

            if (payment == null)
            {
                return new VnpayPaymentCallbackResult
                {
                    isValidSignature = true,
                    isSuccess = false,
                    txnRef = txnRef,
                    responseCode = responseCode,
                    message = "Payment not found"
                };
            }

            payment.vnp_ResponseCode = responseCode;
            payment.vnp_TransactionNo = queryParams.TryGetValue("vnp_TransactionNo", out var transactionNo) ? transactionNo : null;
            payment.vnp_BankCode = queryParams.TryGetValue("vnp_BankCode", out var bankCode) ? bankCode : null;
            payment.vnp_SecureHash = secureHash;

            if (payment.Booking != null)
            {
                if (responseCode == "00")
                {
                    payment.status = VnpayPaymentStatus.Success;
                    payment.paid_at = DateTime.UtcNow;

                    if (payment.Booking.status == BookingStatus.Pending)
                    {
                        payment.Booking.status = BookingStatus.Confirmed;
                    }
                }
                else
                {
                    payment.status = VnpayPaymentStatus.Failed;

                    if (payment.Booking.status == BookingStatus.Pending)
                    {
                        payment.Booking.status = BookingStatus.Cancelled;

                        // Release seats linked to this booking immediately
                        var showtimeSeats = await _dbContext.ShowTimeSeats
                            .Where(sts => sts.booking_id == payment.Booking.booking_id)
                            .ToListAsync();

                        foreach (var sts in showtimeSeats)
                        {
                            sts.status = ShowTimeSeatStatus.Available;
                            sts.booking_id = null;

                            // Delete Redis lock key safely
                            try
                            {
                                var redisDb = _redis.GetDatabase();
                                var lockKey = $"seat_lock:{payment.Booking.showtime_id}:{sts.seat_id}";
                                await redisDb.KeyDeleteAsync(lockKey);
                            }
                            catch (Exception redisEx)
                            {
                                Console.WriteLine($"[Vnpay Callback] Redis error while deleting lock key: {redisEx.Message}");
                            }

                            // Broadcast SignalR SeatUnlocked safely
                            try
                            {
                                await _hubContext.Clients.Group(payment.Booking.showtime_id.ToString()).SendAsync("SeatUnlocked", new
                                {
                                    showtimeId = payment.Booking.showtime_id,
                                    seatId = sts.seat_id
                                });
                            }
                            catch (Exception signalrEx)
                            {
                                Console.WriteLine($"[Vnpay Callback] SignalR error while broadcasting SeatUnlocked: {signalrEx.Message}");
                            }
                        }
                    }
                }
            }
            else
            {
                // Fallback if booking was not eagerly loaded or is missing
                if (responseCode == "00")
                {
                    payment.status = VnpayPaymentStatus.Success;
                    payment.paid_at = DateTime.UtcNow;
                }
                else
                {
                    payment.status = VnpayPaymentStatus.Failed;
                }
            }

            await _dbContext.SaveChangesAsync();

            return new VnpayPaymentCallbackResult
            {
                isValidSignature = true,
                isSuccess = responseCode == "00",
                txnRef = txnRef,
                responseCode = responseCode,
                message = responseCode == "00" ? "Payment success" : "Payment failed",
                status = payment.status
            };
        }

        private string BuildPaymentUrl(VnpayPayment payment, string? returnUrlOverride, string ipAddress)
        {
            // Handle IPv6 localhost
            if (ipAddress == "::1") ipAddress = "127.0.0.1";

            // Use configured ReturnUrl strictly for testing if signature fails
            string rUrl = _vnpayConfig.vnp_ReturnUrl;

            var vnpParams = new SortedDictionary<string, string>(StringComparer.Ordinal)
            {
                ["vnp_Version"] = _vnpayConfig.vnp_Version ?? "2.1.0",
                ["vnp_Command"] = _vnpayConfig.vnp_Command ?? "pay",
                ["vnp_TmnCode"] = _vnpayConfig.vnp_TmnCode,
                ["vnp_Amount"] = ((long)(payment.amount * 100)).ToString(CultureInfo.InvariantCulture),
                ["vnp_CreateDate"] = payment.vnp_CreateDate.ToString("yyyyMMddHHmmss", CultureInfo.InvariantCulture),
                ["vnp_CurrCode"] = _vnpayConfig.vnp_CurrCode ?? "VND",
                ["vnp_IpAddr"] = ipAddress,
                ["vnp_Locale"] = _vnpayConfig.vnp_Locale ?? "vn",
                ["vnp_OrderInfo"] = $"Thanh toan don hang {payment.booking_id}",
                ["vnp_OrderType"] = "other",
                ["vnp_ReturnUrl"] = rUrl,
                ["vnp_TxnRef"] = payment.vnp_TxnRef ?? string.Empty,
                ["vnp_ExpireDate"] = payment.vnp_ExpireDate.ToString("yyyyMMddHHmmss", CultureInfo.InvariantCulture)
            };

            if (payment.method == VnpayPaymentType.VNBANK)
            {
                vnpParams["vnp_BankCode"] = "VNBANK";
            }

            var query = BuildQuery(vnpParams, true);
            string secret = _vnpayConfig.vnp_HashSecret.Trim();
            var secureHash = ComputeHmacSha512(secret, query).ToUpper();

            return $"{_vnpayConfig.vnp_Url}?{query}&vnp_SecureHash={secureHash}";
        }

        private bool ValidateSignature(IReadOnlyDictionary<string, string> queryParams, string secureHash)
        {
            if (string.IsNullOrWhiteSpace(secureHash))
                return false;

            var sorted = new SortedDictionary<string, string>(StringComparer.Ordinal);
            foreach (var kv in queryParams)
            {
                if (kv.Key.StartsWith("vnp_", StringComparison.OrdinalIgnoreCase)
                    && !kv.Key.Equals("vnp_SecureHash", StringComparison.OrdinalIgnoreCase)
                    && !kv.Key.Equals("vnp_SecureHashType", StringComparison.OrdinalIgnoreCase)
                    && !string.IsNullOrWhiteSpace(kv.Value))
                {
                    sorted[kv.Key] = kv.Value;
                }
            }

            var hashData = BuildQuery(sorted, true);
            var computed = ComputeHmacSha512(_vnpayConfig.vnp_HashSecret, hashData);
            return string.Equals(computed, secureHash, StringComparison.OrdinalIgnoreCase);
        }

        private static string BuildQuery(SortedDictionary<string, string> parameters, bool encode)
        {
            var sb = new StringBuilder();
            foreach (var kv in parameters)
            {
                if (string.IsNullOrEmpty(kv.Value))
                    continue;

                if (sb.Length > 0)
                    sb.Append('&');

                sb.Append(kv.Key);
                sb.Append('=');
                sb.Append(encode ? UrlEncodeVnpay(kv.Value) : kv.Value);
            }

            return sb.ToString();
        }

        private static string UrlEncodeVnpay(string value)
        {
            var encoded = System.Net.WebUtility.UrlEncode(value);
            if (encoded == null) return "";
            
            var sb = new StringBuilder();
            for (int i = 0; i < encoded.Length; i++)
            {
                if (encoded[i] == '%')
                {
                    sb.Append('%');
                    sb.Append(char.ToUpper(encoded[i + 1]));
                    sb.Append(char.ToUpper(encoded[i + 2]));
                    i += 2;
                }
                else
                {
                    sb.Append(encoded[i]);
                }
            }
            return sb.ToString();
        }

        private static string ComputeHmacSha512(string key, string data)
        {
            var keyBytes = Encoding.UTF8.GetBytes(key);
            var dataBytes = Encoding.UTF8.GetBytes(data);
            using var hmac = new HMACSHA512(keyBytes);
            var hash = hmac.ComputeHash(dataBytes);
            return Convert.ToHexString(hash).ToLower();
        }
    }
}
