using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace CinemaAPI.Services.Implementations
{
    public class PaymentService : IPaymentService
    {
        private readonly AppDbContext _dbContext;
        private readonly VnpayConfig _vnpayConfig;

        public PaymentService(AppDbContext dbContext, IOptions<VnpayConfig> vnpayConfig)
        {
            _dbContext = dbContext;
            _vnpayConfig = vnpayConfig.Value;
        }

        public async Task<List<Payment>> GetAllPaymentsAsync() =>
            await _dbContext.Payments
                .AsNoTracking()
                .Include(p => p.Booking)
                .ThenInclude(b => b.ShowTime)
                .OrderByDescending(p => p.payment_id)
                .ToListAsync();

        public async Task<Payment?> GetPaymentByIdAsync(int paymentId) =>
            await _dbContext.Payments
                .AsNoTracking()
                .Include(p => p.Booking)
                .ThenInclude(b => b.ShowTime)
                .FirstOrDefaultAsync(p => p.payment_id == paymentId);

        public async Task<CreatePaymentResult> CreatePaymentUrlAsync(PaymentCreateRequest request, string ipAddress)
        {
            var booking = await _dbContext.Bookings.FirstOrDefaultAsync(b => b.booking_id == request.booking_id);
            if (booking == null)
                throw new Exception($"Booking {request.booking_id} not found.");

            if (request.method != PaymentType.VNPAYQR && request.method != PaymentType.VNBANK)
                throw new Exception("Unsupported payment method.");

            var amount = request.amount ?? booking.finalAmount;
            if (amount <= 0)
                throw new Exception("Payment amount must be greater than 0.");

            var vnNow = DateTime.UtcNow.AddHours(7);
            var expireAt = vnNow.AddMinutes(15);
            var txnRef = $"B{booking.booking_id}_{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}";

            var payment = new Payment
            {
                booking_id = booking.booking_id,
                amount = amount,
                method = request.method,
                status = PaymentStatus.Pending,
                vnp_TxnRef = txnRef,
                vnp_OrderInfo = string.IsNullOrWhiteSpace(request.orderInfo)
                    ? $"Thanh toan booking #{booking.booking_id}"
                    : request.orderInfo.Trim(),
                vnp_IpAddr = ipAddress,
                vnp_CreateDate = vnNow,
                vnp_ExpireDate = expireAt
            };

            _dbContext.Payments.Add(payment);
            await _dbContext.SaveChangesAsync();

            var paymentUrl = BuildPaymentUrl(payment, request.returnUrl, ipAddress);

            return new CreatePaymentResult
            {
                payment_id = payment.payment_id,
                txnRef = payment.vnp_TxnRef ?? string.Empty,
                paymentUrl = paymentUrl,
                status = payment.status,
                expireAt = payment.vnp_ExpireDate
            };
        }

        public async Task<PaymentCallbackResult> HandleVnpayCallbackAsync(IReadOnlyDictionary<string, string> queryParams)
        {
            var secureHash = queryParams.TryGetValue("vnp_SecureHash", out var hash) ? hash : string.Empty;
            var txnRef = queryParams.TryGetValue("vnp_TxnRef", out var refValue) ? refValue : string.Empty;
            var responseCode = queryParams.TryGetValue("vnp_ResponseCode", out var code) ? code : string.Empty;

            if (string.IsNullOrWhiteSpace(txnRef))
            {
                return new PaymentCallbackResult
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
                return new PaymentCallbackResult
                {
                    isValidSignature = false,
                    isSuccess = false,
                    txnRef = txnRef,
                    responseCode = responseCode,
                    message = "Invalid signature"
                };
            }

            var payment = await _dbContext.Payments
                .Include(p => p.Booking)
                .FirstOrDefaultAsync(p => p.vnp_TxnRef == txnRef);

            if (payment == null)
            {
                return new PaymentCallbackResult
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

            if (responseCode == "00")
            {
                payment.status = PaymentStatus.Success;
                payment.paid_at = DateTime.UtcNow;

                if (payment.Booking.status == BookingStatus.Pending)
                {
                    payment.Booking.status = BookingStatus.Confirmed;
                }
            }
            else
            {
                payment.status = PaymentStatus.Failed;
            }

            await _dbContext.SaveChangesAsync();

            return new PaymentCallbackResult
            {
                isValidSignature = true,
                isSuccess = responseCode == "00",
                txnRef = txnRef,
                responseCode = responseCode,
                message = responseCode == "00" ? "Payment success" : "Payment failed",
                status = payment.status
            };
        }
<<<<<<< HEAD
        public async Task DeletePayment(int payment_id)
        {
           try
            {
                var payment = await _dbContext.Payments.FindAsync(payment_id);
                if (payment == null)
                    throw new Exception("Payment not found");
                payment.deleted_at = DateOnly.FromDateTime(DateTime.UtcNow);
                await _dbContext.SaveChangesAsync();
            
            }
          catch (Exception ex)
            {
                Console.WriteLine($"Error deleting payment: {ex.Message}");
                throw new Exception("An error occurred while deleting the payment. Please try again.", ex);
=======

        private string BuildPaymentUrl(Payment payment, string? returnUrlOverride, string ipAddress)
        {
            var vnpParams = new SortedDictionary<string, string>(StringComparer.Ordinal)
            {
                ["vnp_Version"] = _vnpayConfig.vnp_Version,
                ["vnp_Command"] = _vnpayConfig.vnp_Command,
                ["vnp_TmnCode"] = _vnpayConfig.vnp_TmnCode,
                ["vnp_Amount"] = ((long)(payment.amount * 100)).ToString(CultureInfo.InvariantCulture),
                ["vnp_CreateDate"] = payment.vnp_CreateDate.ToString("yyyyMMddHHmmss", CultureInfo.InvariantCulture),
                ["vnp_ExpireDate"] = payment.vnp_ExpireDate.ToString("yyyyMMddHHmmss", CultureInfo.InvariantCulture),
                ["vnp_CurrCode"] = _vnpayConfig.vnp_CurrCode,
                ["vnp_IpAddr"] = ipAddress,
                ["vnp_Locale"] = _vnpayConfig.vnp_Locale,
                ["vnp_OrderInfo"] = payment.vnp_OrderInfo ?? string.Empty,
                ["vnp_OrderType"] = "other",
                ["vnp_ReturnUrl"] = string.IsNullOrWhiteSpace(returnUrlOverride) ? _vnpayConfig.vnp_ReturnUrl : returnUrlOverride.Trim(),
                ["vnp_TxnRef"] = payment.vnp_TxnRef ?? string.Empty
            };

            if (payment.method == PaymentType.VNBANK)
            {
                vnpParams["vnp_BankCode"] = "VNBANK";
            }

            var hashData = BuildQuery(vnpParams, encodeValues: false);
            var secureHash = ComputeHmacSha512(_vnpayConfig.vnp_HashSecret, hashData);

            var query = BuildQuery(vnpParams, encodeValues: true);
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
>>>>>>> 64b54274b703aa37d89b1771b91e6500cdf8b73b
            }

            var hashData = BuildQuery(sorted, encodeValues: false);
            var computed = ComputeHmacSha512(_vnpayConfig.vnp_HashSecret, hashData);
            return string.Equals(computed, secureHash, StringComparison.OrdinalIgnoreCase);
        }

        private static string BuildQuery(SortedDictionary<string, string> parameters, bool encodeValues)
        {
            var sb = new StringBuilder();
            foreach (var kv in parameters)
            {
                if (sb.Length > 0)
                    sb.Append('&');

                var key = Uri.EscapeDataString(kv.Key);
                var value = encodeValues ? Uri.EscapeDataString(kv.Value) : kv.Value;
                sb.Append(key).Append('=').Append(value);
            }

            return sb.ToString();
        }

        private static string ComputeHmacSha512(string key, string data)
        {
            var keyBytes = Encoding.UTF8.GetBytes(key);
            var dataBytes = Encoding.UTF8.GetBytes(data);
            using var hmac = new HMACSHA512(keyBytes);
            var hash = hmac.ComputeHash(dataBytes);
            return Convert.ToHexString(hash);
        }
    }
}
