using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Implementations;
using CinemaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CinemaAPI.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class cinemaController : ControllerBase
    {
        private readonly ICinemaService _cinemaService;
// removed _cinemaDeleteService
        public cinemaController(ICinemaService cinemaService)
        {
            _cinemaService = cinemaService;
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllCinemas()
        {
            try
            {
                var cinemas = await _cinemaService.GetAllCinemas();
                return Ok(cinemas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in cinemaController.GetAllCinemas: {ex.Message}");
            }
        }

        [HttpGet("get/{cinemaId}")]
        public async Task<IActionResult> GetCinema(int cinemaId)
        {
            try
            {
                var cinema = await _cinemaService.GetCinemaById(cinemaId);
                if (cinema == null)
                    return NotFound("Cinema not found");

                return Ok(cinema);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in cinemaController.GetCinema: {ex.Message}");
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateCinema([FromBody] CinemaCreateRequest request)
        {
            try
            {
                await _cinemaService.AddCinema(request);
                return Ok("Cinema created successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in cinemaController.CreateCinema: {ex.Message}");
            }
        }

        [HttpPut("update/{cinemaId}")]
        public async Task<IActionResult> UpdateCinema(int cinemaId, [FromBody] CinemaUpdateRequest request)
        {
            try
            {
                await _cinemaService.UpdateCinema(cinemaId, request);
                return Ok("Cinema updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in cinemaController.UpdateCinema: {ex.Message}");
            }
        }

        [HttpDelete("delete/{cinemaId}")]
        public async Task<IActionResult> DeleteCinema(int cinemaId)
        {
            try
            {
                var userIdValue = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                Guid? deletedBy = string.IsNullOrEmpty(userIdValue) ? (Guid?)null : Guid.Parse(userIdValue);

                await _cinemaService.SoftDeleteCinema(cinemaId, deletedBy);
                return Ok("Cinema deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in cinemaController.DeleteCinema: {ex.Message}");
            }
        }

        [HttpDelete("hard-delete/{cinemaId}")]
        public async Task<IActionResult> HardDeleteCinema(int cinemaId)
        {
            try
            {
                await _cinemaService.HardDeleteCinema(cinemaId);
                return Ok("Cinema hard deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in cinemaController.HardDeleteCinema: {ex.Message}");
            }
        }
    }
}