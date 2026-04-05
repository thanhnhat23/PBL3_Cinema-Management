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
        public async Task<IActionResult> CreateBooking( [FromBody] BookingCreateRequest request)
        {
            try
            {
                var userId = Guid.Parse(request.user_id);
                var booking = new Booking
                {
                    user_id = userId,
                    showtime_id = request.showtime_id,
                    coupon_id = request.coupon_id,
                    totalAmount = request.totalAmount,
                    discountAmount = request.discountAmount,
                    finalAmount = request.finalAmount,
                    createAt = request.createAt ?? DateTime.Now,
                    status = BookingStatus.Pending
                };

                await _bookingService.AddBooking(booking);
                return Ok("Booking created successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in bookingController.CreateBooking: {ex.Message}");
            }
        }
        //[HttpPut("update/{bookingId}")]
       // public async Task<IActionResult> UpdateBooking(in)
       [HttpDelete("delete/{bookingId}")]
        public async Task<IActionResult> DeleteBooking(int bookingId)
        {
            try
            {
                await _bookingService.DeleteBooking(bookingId);
                return Ok("Booking deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in bookingController.DeleteBooking: {ex.Message}");
            }
        }
        
}
}