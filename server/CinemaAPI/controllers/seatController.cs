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

        [HttpPost("create")]
        public async Task<IActionResult> CreateSeat([FromBody] SeatCreateRequest request)
        {
            try
            {
                var seat = new Seat
                {
                    room_id = request.room_id,
                    type_id = request.type_id,
                    row_index = request.row_index,
                    column_index = request.column_index,
                    seat_code = request.seat_code
                };

                await _seatService.AddSeat(seat);
                return Ok("Seat created successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in seatController.CreateSeat: {ex.Message}");
            }
        }

        [HttpPut("update/{seatId}")]
        public async Task<IActionResult> UpdateSeat(int seatId, [FromBody] SeatUpdateRequest request)
        {
            try
            {
                await _seatService.UpdateSeat(seatId, request);
                return Ok("Seat updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in seatController.UpdateSeat: {ex.Message}");
            }
        }

        [HttpDelete("delete/{seatId}")]
        public async Task<IActionResult> DeleteSeat(int seatId)
        {
            try
            {
                await _seatService.DeleteSeat(seatId);
                return Ok("Seat deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in seatController.DeleteSeat: {ex.Message}");
            }
        }
    }
}
