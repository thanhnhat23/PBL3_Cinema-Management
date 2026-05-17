using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
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
    public class MomoPaymentService : IMomoPaymentService
    {
        private readonly AppDbContext _dbContext;
        private readonly MomoConfig _momoConfig;
        private readonly HttpClient _httpClient;
        private readonly IConnectionMultiplexer _redis;
        private readonly IHubContext<SeatLockHub> _hubContext;

        public MomoPaymentService(
            AppDbContext dbContext, 
            IOptions<MomoConfig> momoConfig, 
            HttpClient httpClient,
            IConnectionMultiplexer redis,
            IHubContext<SeatLockHub> hubContext)
        {
            _dbContext = dbContext;
            _momoConfig = momoConfig.Value;
            _httpClient = httpClient;
            _redis = redis;
            _hubContext = hubContext;
        }

        public async Task<List<MomoPayment>> GetAllPaymentsAsync() =>
            await _dbContext.MomoPayments
                .AsNoTracking()
                .Include(p => p.Booking)
                .ThenInclude(b => b.ShowTime)
                .OrderByDescending(p => p.payment_id)
                .ToListAsync();

        public async Task<MomoPayment?> GetPaymentByIdAsync(int paymentId) =>
            await _dbContext.MomoPayments
                .AsNoTracking()
                .Include(p => p.Booking)
                .ThenInclude(b => b.ShowTime)
                .FirstOrDefaultAsync(p => p.payment_id == paymentId);

        public async Task<CreateMomoPaymentResult> CreatePaymentUrlAsync(MomoPaymentCreateRequest request)
        {
            var booking = await _dbContext.Bookings.FirstOrDefaultAsync(b => b.booking_id == request.booking_id);
            if (booking == null)
                throw new Exception($"Booking {request.booking_id} not found.");

            if (booking.status != BookingStatus.Pending)
                throw new Exception("Booking is already processed or cancelled. Cannot create payment.");

            var amount = (long)booking.finalAmount;
            var orderId = $"M{booking.booking_id}_{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}";
            var requestId = Guid.NewGuid().ToString();
            var orderInfo = $"Thanh toan don hang {booking.booking_id}";
            var requestType = request.requestType ?? _momoConfig.WalletRequestType;
            var extraData = "";
            var redirectUrl = request.returnUrl ?? _momoConfig.ReturnUrl;
            var ipnUrl = _momoConfig.NotifyUrl;

            // Create signature
            var rawSignature = $"accessKey={_momoConfig.AccessKey}&amount={amount}&extraData={extraData}&ipnUrl={ipnUrl}&orderId={orderId}&orderInfo={orderInfo}&partnerCode={_momoConfig.PartnerCode}&redirectUrl={redirectUrl}&requestId={requestId}&requestType={requestType}";
            var signature = ComputeHmacSha256(_momoConfig.SecretKey, rawSignature);

            var momoRequest = new
            {
                partnerCode = _momoConfig.PartnerCode,
                requestId = requestId,
                amount = amount,
                orderId = orderId,
                orderInfo = orderInfo,
                redirectUrl = redirectUrl,
                ipnUrl = ipnUrl,
                requestType = requestType,
                extraData = extraData,
                lang = "vi",
                signature = signature,
                expireAfter = 5 // 5 minutes
            };

            var payment = new MomoPayment
            {
                booking_id = booking.booking_id,
                amount = amount,
                requestType = requestType,
                status = MomoPaymentStatus.Pending,
                orderId = orderId,
                requestId = requestId,
                orderInfo = orderInfo,
                createdAt = DateTime.UtcNow
            };

            _dbContext.MomoPayments.Add(payment);
            await _dbContext.SaveChangesAsync();

            var response = await _httpClient.PostAsJsonAsync(_momoConfig.MomoApiUrl, momoRequest);
            var responseContent = await response.Content.ReadAsStringAsync();

            var result = JsonSerializer.Deserialize<MomoApiResponse>(responseContent, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (result == null || result.resultCode != 0)
            {
                payment.status = MomoPaymentStatus.Failed;
                payment.message = result?.message?.Length > 100 ? result.message.Substring(0, 100) : result?.message ?? "Error connecting to MoMo";
                await _dbContext.SaveChangesAsync();
                throw new Exception(payment.message ?? "Error connecting to MoMo");
            }

            return new CreateMomoPaymentResult
            {
                payment_id = payment.payment_id,
                orderId = orderId,
                payUrl = result.payUrl,
                status = payment.status
            };
        }

        public async Task<MomoPaymentCallbackResult> HandleMomoCallbackAsync(IReadOnlyDictionary<string, string> queryParams)
        {
            var orderId = queryParams.GetValueOrDefault("orderId") ?? "";
            var requestId = queryParams.GetValueOrDefault("requestId") ?? "";
            var amount = queryParams.GetValueOrDefault("amount") ?? "";
            var orderInfo = queryParams.GetValueOrDefault("orderInfo") ?? "";
            var orderType = queryParams.GetValueOrDefault("orderType") ?? "";
            var transId = queryParams.GetValueOrDefault("transId") ?? "";
            var resultCodeStr = queryParams.GetValueOrDefault("resultCode") ?? "";
            var resultCode = int.Parse(resultCodeStr == "" ? "-1" : resultCodeStr);
            var message = queryParams.GetValueOrDefault("message") ?? "";
            var responseTime = queryParams.GetValueOrDefault("responseTime") ?? "";
            var extraData = queryParams.GetValueOrDefault("extraData") ?? "";
            var payType = queryParams.GetValueOrDefault("payType") ?? "";
            var signature = queryParams.GetValueOrDefault("signature") ?? "";

            var rawSignature = $"accessKey={_momoConfig.AccessKey}&amount={amount}&extraData={extraData}&message={message}&orderId={orderId}&orderInfo={orderInfo}&orderType={orderType}&partnerCode={_momoConfig.PartnerCode}&payType={payType}&requestId={requestId}&responseTime={responseTime}&resultCode={resultCodeStr}&transId={transId}";
            var computedSignature = ComputeHmacSha256(_momoConfig.SecretKey, rawSignature);

            var isValid = string.Equals(signature, computedSignature, StringComparison.OrdinalIgnoreCase);

            var payment = await _dbContext.MomoPayments
                .Include(p => p.Booking)
                .FirstOrDefaultAsync(p => p.orderId == orderId);

            if (payment == null)
            {
                return new MomoPaymentCallbackResult
                {
                    isValidSignature = isValid,
                    isSuccess = false,
                    orderId = orderId,
                    message = "Payment not found"
                };
            }

            if (isValid)
            {
                payment.transId = transId;
                payment.resultCode = resultCode;
                payment.message = message;
                payment.signature = signature;

                if (payment.Booking != null)
                {
                    if (resultCode == 0)
                    {
                        payment.status = MomoPaymentStatus.Success;
                        payment.paidAt = DateTime.UtcNow;

                        if (payment.Booking.status == BookingStatus.Pending)
                        {
                            payment.Booking.status = BookingStatus.Confirmed;
                        }
                    }
                    else
                    {
                        payment.status = MomoPaymentStatus.Failed;

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
                                    Console.WriteLine($"[Momo Callback] Redis error while deleting lock key: {redisEx.Message}");
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
                                    Console.WriteLine($"[Momo Callback] SignalR error while broadcasting SeatUnlocked: {signalrEx.Message}");
                                }
                            }
                        }
                    }
                }
                else
                {
                    // Fallback if booking was not eagerly loaded or is missing
                    if (resultCode == 0)
                    {
                        payment.status = MomoPaymentStatus.Success;
                        payment.paidAt = DateTime.UtcNow;
                    }
                    else
                    {
                        payment.status = MomoPaymentStatus.Failed;
                    }
                }

                await _dbContext.SaveChangesAsync();
            }

            return new MomoPaymentCallbackResult
            {
                isValidSignature = isValid,
                isSuccess = isValid && resultCode == 0,
                orderId = orderId,
                message = message,
                resultCode = resultCode,
                status = payment.status
            };
        }

        private static string ComputeHmacSha256(string key, string data)
        {
            var keyBytes = Encoding.UTF8.GetBytes(key);
            var dataBytes = Encoding.UTF8.GetBytes(data);
            using var hmac = new HMACSHA256(keyBytes);
            var hash = hmac.ComputeHash(dataBytes);
            return BitConverter.ToString(hash).Replace("-", "").ToLower();
        }

        private class MomoApiResponse
        {
            public string partnerCode { get; set; } = null!;
            public string orderId { get; set; } = null!;
            public string requestId { get; set; } = null!;
            public long amount { get; set; }
            public long responseTime { get; set; }
            public string message { get; set; } = null!;
            public int resultCode { get; set; }
            public string payUrl { get; set; } = null!;
            public string? deeplink { get; set; }
            public string? qrCodeUrl { get; set; }
            public string signature { get; set; } = null!;
        }
    }
}
