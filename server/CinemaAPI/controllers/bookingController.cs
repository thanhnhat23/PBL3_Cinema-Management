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
                return StatusCode(500, $"An error occurred in bookingController.CreateBooking: {ex.Message}");
            }
        }
    }
}