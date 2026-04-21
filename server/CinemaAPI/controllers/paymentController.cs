using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CinemaAPI.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class paymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public paymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllPayments()
        {
            var payments = await _paymentService.GetAllPaymentsAsync();
            return Ok(payments);
        }

        [HttpGet("get/{paymentId:int}")]
        public async Task<IActionResult> GetPaymentById(int paymentId)
        {
            var payment = await _paymentService.GetPaymentByIdAsync(paymentId);
            if (payment == null)
                return NotFound("Payment not found");

            return Ok(payment);
        }

        [HttpPost("create-url")]
        public async Task<IActionResult> CreatePaymentUrl([FromBody] PaymentCreateRequest request)
        {
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
            var result = await _paymentService.CreatePaymentUrlAsync(request, ipAddress);
            return Ok(result);
        }

        [HttpGet("vnpay-return")]
        public async Task<IActionResult> VnpayReturn()
        {
            var query = Request.Query.ToDictionary(k => k.Key, v => v.Value.ToString());
            var result = await _paymentService.HandleVnpayCallbackAsync(query);
            return Ok(result);
        }

        [HttpGet("vnpay-ipn")]
        public async Task<IActionResult> VnpayIpn()
        {
            var query = Request.Query.ToDictionary(k => k.Key, v => v.Value.ToString());
            var result = await _paymentService.HandleVnpayCallbackAsync(query);

            // VNPAY IPN expects specific fields: RspCode + Message
            if (!result.isValidSignature)
                return Ok(new { RspCode = "97", Message = "Invalid signature" });

            if (!result.isSuccess)
                return Ok(new { RspCode = "00", Message = "Confirm Failure" });

            return Ok(new { RspCode = "00", Message = "Confirm Success" });
        }
    }
}
