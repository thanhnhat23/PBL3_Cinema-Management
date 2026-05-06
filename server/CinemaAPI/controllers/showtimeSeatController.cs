using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CinemaAPI.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class showtimeSeatController : ControllerBase
    {
        private readonly IShowTimeSeatService _service;

        public showtimeSeatController(IShowTimeSeatService service)
        {
            _service = service;
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var items = await _service.GetAllShowTimeSeats();
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var item = await _service.GetShowTimeSeatById(id);
                if (item == null) return NotFound();
                return Ok(item);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] ShowTimeSeatCreateRequest req)
        {
            try
            {
                var s = new ShowTimeSeat
                {
                    seat_id = req.seat_id,
                    showtime_id = req.showtime_id,
                    booking_id = req.booking_id,
                    status = (ShowTimeSeatStatus)req.status
                };

                await _service.AddShowTimeSeat(s);
                return Ok("Created");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ShowTimeSeatUpdateRequest req)
        {
            try
            {
                await _service.UpdateShowTimeSeat(id, req);
                return Ok("Updated");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _service.DeleteShowTimeSeat(id);
                return Ok("Deleted");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }
    }
}
