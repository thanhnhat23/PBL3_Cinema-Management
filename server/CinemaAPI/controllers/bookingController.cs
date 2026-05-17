using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CinemaAPI.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class bookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        public bookingController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }
        
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllBookings()
        {
            try
            {
                var bookings = await _bookingService.GetAllBookings();
                return Ok(bookings);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in bookingController.GetAllBookings: {ex.Message}");
            }
        }

        [HttpGet("get/{bookingId}")]
        public async Task<IActionResult> GetBooking(int bookingId)
        {
            try
            {
                var booking = await _bookingService.GetBookingById(bookingId);
                if (booking == null)
                    return NotFound("Booking not found");

                return Ok(booking);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in bookingController.GetBooking: {ex.Message}");
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateBooking([FromBody] BookingCreateRequest request)
        {
            try
            {
                var booking = await _bookingService.CreateBookingWithSnacksAsync(request);
                return Ok(new
                {
                    booking.booking_id,
                    booking.totalAmount,
                    booking.discountAmount,
                    booking.finalAmount,
                    booking.status,
                });
            }
            catch (Exception ex)
            {
                // Return 400 for validation errors (like already used coupon)
                if (ex.Message.Contains("already used") || ex.Message.Contains("not valid") || ex.Message.Contains("Minimum order value"))
                {
                    return BadRequest(ex.Message);
                }
                return StatusCode(500, $"An error occurred in bookingController.CreateBooking: {ex.Message}");
            }
        }

        [HttpPost("refund/{bookingId}")]
        public async Task<IActionResult> RefundBooking(int bookingId)
        {
            try
            {
                var userIdValue = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                Guid? processedBy = string.IsNullOrEmpty(userIdValue) ? (Guid?)null : Guid.Parse(userIdValue);

                await _bookingService.RefundBooking(bookingId, processedBy);
                return Ok("Booking refunded successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in bookingController.RefundBooking: {ex.Message}");
            }
        }

        [HttpPost("cancel/{bookingId}")]
        public async Task<IActionResult> CancelBooking(int bookingId)
        {
            try
            {
                var userIdValue = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                Guid? processedBy = string.IsNullOrEmpty(userIdValue) ? (Guid?)null : Guid.Parse(userIdValue);

                await _bookingService.CancelBooking(bookingId, processedBy);
                return Ok("Booking cancelled successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in bookingController.CancelBooking: {ex.Message}");
            }
        }
    }
}