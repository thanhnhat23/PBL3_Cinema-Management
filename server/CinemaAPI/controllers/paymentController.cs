using CinemaAPI.Models;
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
            try
            {
                var payments = await _paymentService.GetAllPayments();
                return Ok(payments);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in paymentController.GetAllPayments: {ex.Message}");
            }
        }
        [HttpGet("get/{paymentId}")]
        public async Task<IActionResult> GetPayment(int paymentId)
        {
            try
            {
                var payment = await _paymentService.GetPaymentById(paymentId);
                if (payment == null)
                    return NotFound("Payment not found");

                return Ok(payment);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in paymentController.GetPayment: {ex.Message}");
            }
        }
        [HttpPost("create")]
        public async Task<IActionResult> CreatePayment([FromBody] PaymentCreateRequest request)
        {
            try
            {
                var payment = new Payment
                {
                    booking_id = request.booking_id,
                    amount = request.amount,
                    method = request.method,
                    status = request.status,
                    provider = request.provider,
                    transaction_code = request.transaction_code,
                    paidAt = request.paidAt,
                    refund_code = request.refund_code,
                    refundAt = request.refundAt ?? DateTime.Now
                };
                await _paymentService.AddPayment(payment);
                return Ok("Payment created successfully");
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in paymentController.CreatePayment: {ex.Message}");
            }
        }
        [HttpPut("update/{paymentId}")]
        public async Task<IActionResult> UpdatePayment(int paymentId, [FromBody] PaymentUpdateRequest request)
        {
            try
            {
                await _paymentService.UpdatePayment(paymentId, request);
                return Ok("Payment updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in paymentController.UpdatePayment: {ex.Message}");
            }
        }
    }
}