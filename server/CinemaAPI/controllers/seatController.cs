using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CinemaAPI.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class seatController : ControllerBase
    {
        private readonly ISeatService _seatService;

        public seatController(ISeatService seatService)
        {
            _seatService = seatService;
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllSeats()
        {
            try
            {
                var seats = await _seatService.GetAllSeats();
                return Ok(seats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in seatController.GetAllSeats: {ex.Message}");
            }
        }

        [HttpGet("get/{seatId}")]
        public async Task<IActionResult> GetSeat(int seatId)
        {
            try
            {
                var seat = await _seatService.GetSeatById(seatId);
                if (seat == null)
                    return NotFound("Seat not found");

                return Ok(seat);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in seatController.GetSeat: {ex.Message}");
            }
        }

        [HttpGet("get-room/{roomId}")]
        public async Task<IActionResult> GetSeatsOnRoom(int roomId)
        {
            try
            {
                var seats = await _seatService.GetSeatOnRoom(roomId);
                return Ok(seats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in seatController.GetSeatsOnRoom: {ex.Message}");
            }
        }
    }
}
