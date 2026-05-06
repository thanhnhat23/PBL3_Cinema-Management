using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CinemaAPI.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class showtimeSlotController : ControllerBase
    {
        private readonly IShowTimeSlotService _service;

        public showtimeSlotController(IShowTimeSlotService service)
        {
            _service = service;
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var items = await _service.GetAllSlots();
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
                var item = await _service.GetSlotById(id);
                if (item == null) return NotFound();
                return Ok(item);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] ShowTimeSlotCreateRequest req)
        {
            try
            {
                if (req.dayOfWeek < 0 || req.dayOfWeek > 6)
                    return BadRequest("dayOfWeek must be 0-6 (0=Sunday, 6=Saturday)");

                if (!TimeSpan.TryParse(req.startTime, out var startTs))
                    return BadRequest($"Invalid startTime format: {req.startTime}. Use HH:mm");

                if (!TimeSpan.TryParse(req.endTime, out var endTs))
                    return BadRequest($"Invalid endTime format: {req.endTime}. Use HH:mm");

                if (endTs <= startTs)
                    return BadRequest("endTime must be after startTime");

                var slot = new ShowTimeSlot
                {
                    dayOfWeek = req.dayOfWeek,
                    startTime = startTs,
                    endTime = endTs,
                    reusable = req.reusable ?? true,
                    status = req.status.HasValue ? (ShowTimeSlotStatus)req.status.Value : ShowTimeSlotStatus.Scheduled
                };

                await _service.AddSlot(slot);
                return Ok(new { slot.slot_id, message = "Slot created successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ShowTimeSlotUpdateRequest req)
        {
            try
            {
                await _service.UpdateSlot(id, req);
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
                await _service.SoftDeleteSlot(id);
                return Ok("Deleted");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }

        [HttpDelete("hard-delete/{id}")]
        public async Task<IActionResult> HardDelete(int id)
        {
            try
            {
                await _service.HardDeleteSlot(id);
                return Ok("Hard deleted");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error: {ex.Message}");
            }
        }
    }
}
