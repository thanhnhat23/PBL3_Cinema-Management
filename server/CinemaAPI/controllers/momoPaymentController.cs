using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CinemaAPI.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class momoPaymentController : ControllerBase
    {
        private readonly IMomoPaymentService _paymentService;

        public momoPaymentController(IMomoPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllPayments()
        {
            return Ok(await _paymentService.GetAllPaymentsAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPaymentById(int id)
        {
            var payment = await _paymentService.GetPaymentByIdAsync(id);
            if (payment == null) return NotFound();
            return Ok(payment);
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreatePaymentUrl([FromBody] MomoPaymentCreateRequest request)
        {
            try
            {
                var result = await _paymentService.CreatePaymentUrlAsync(request);
                return Ok(result);
            }
            catch (Microsoft.EntityFrameworkCore.DbUpdateException dbEx)
            {
                var innerMsg = dbEx.InnerException?.Message ?? dbEx.Message;
                Console.WriteLine($"DB Error: {innerMsg}");
                return BadRequest(new { message = $"Database error: {innerMsg}" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("callback")]
        public async Task<IActionResult> MomoCallback()
        {
            var queryParams = Request.Query.ToDictionary(q => q.Key, q => q.Value.ToString());
            var result = await _paymentService.HandleMomoCallbackAsync(queryParams);
            return Ok(result);
        }
    }
}
