using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Implementations;
using CinemaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CinemaAPI.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class showtimeController : ControllerBase
    {
        private readonly IShowTimeService _showTimeService;
// removed _showTimeDeleteService

        public showtimeController(IShowTimeService showTimeService)
        {
            _showTimeService = showTimeService;
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var items = await _showTimeService.GetAllShowTimes();
                return Ok(items);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in showtimeController.GetAll: {ex.Message}");
            }
        }

        [HttpGet("get/{id}")]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                var item = await _showTimeService.GetShowTimeById(id);
                if (item == null) return NotFound("Showtime not found");
                return Ok(item);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in showtimeController.Get: {ex.Message}");
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> Create([FromBody] ShowTimeCreateRequest request)
        {
            try
            {
                var st = new ShowTime
                {
                    room_id = request.room_id,
                    movie_id = request.movie_id,
                    startTime = request.startTime,
                    endTime = request.endTime,
                    slot_id = request.slot_id
                };

                if (request.pricing_model.HasValue)
                {
                    st.pricing_model = (PricingModel)request.pricing_model.Value;
                }

                await _showTimeService.AddShowTime(st);
                return Ok("Showtime created successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in showtimeController.Create: {ex.Message}");
            }
        }

        [HttpPost("create-from-slot")]
        public async Task<IActionResult> CreateFromSlot([FromBody] ShowTimeFromSlotRequest request)
        {
            try
            {
                var showtime = await _showTimeService.CreateShowTimeFromSlotAsync(request);
                return Ok(new
                {
                    showtime.showtime_id,
                    showtime.movie_id,
                    showtime.room_id,
                    showtime.slot_id,
                    showtime.startTime,
                    showtime.endTime,
                    showtime.pricing_model,
                    message = "Showtime created from slot successfully."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in showtimeController.CreateFromSlot: {ex.Message}");
            }
        }

        [HttpPut("update/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ShowTimeUpdateRequest request)
        {
            try
            {
                await _showTimeService.UpdateShowTime(id, request);
                return Ok("Showtime updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in showtimeController.Update: {ex.Message}");
            }
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var userIdValue = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                Guid? deletedBy = string.IsNullOrEmpty(userIdValue) ? (Guid?)null : Guid.Parse(userIdValue);

                await _showTimeService.SoftDeleteShowTime(id, deletedBy);
                return Ok("Showtime deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in showtimeController.Delete: {ex.Message}");
            }
        }

        [HttpDelete("hard-delete/{id}")]
        public async Task<IActionResult> HardDelete(int id)
        {
            try
            {
                await _showTimeService.HardDeleteShowTime(id);
                return Ok("Showtime hard deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in showtimeController.HardDelete: {ex.Message}");
            }
        }
    }
}
