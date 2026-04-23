using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Implementations;
using CinemaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CinemaAPI.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class snackController : ControllerBase
    {
        private readonly ISnackService _snackService;
        private readonly SnackService _snackDeleteService;

        public snackController(ISnackService snackService, SnackService snackDeleteService)
        {
            _snackService = snackService;
            _snackDeleteService = snackDeleteService;
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllSnacks()
        {
            try
            {
                var snacks = await _snackService.GetAllSnacks();
                return Ok(snacks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in snackController.GetAllSnacks: {ex.Message}");
            }
        }

        [HttpGet("get/{snackId}")]
        public async Task<IActionResult> GetSnack(int snackId)
        {
            try
            {
                var snack = await _snackService.GetSnackById(snackId);
                if (snack == null)
                    return NotFound("Snack not found");

                return Ok(snack);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in snackController.GetSnack: {ex.Message}");
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateSnack([FromBody] SnackCreateRequest request)
        {
            try
            {
                var snack = new Snack
                {
                    name = request.name,
                    price = request.price
                };
                await _snackService.AddSnack(snack);
                return Ok("Snack created successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in snackController.CreateSnack: {ex.Message}");
            }
        }

        [HttpPut("update/{snackId}")]
        public async Task<IActionResult> UpdateSnack(int snackId, [FromBody] SnackUpdateRequest request)
        {
            try
            {
                await _snackService.UpdateSnack(snackId, request);
                return Ok("Snack updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in snackController.UpdateSnack: {ex.Message}");
            }
        }

        [HttpDelete("delete/{snackId}")]
        public async Task<IActionResult> DeleteSnack(int snackId)
        {
            try
            {
                await _snackDeleteService.SoftDeleteSnackById(snackId);
                return Ok("Snack deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(0, "");
            }
        }

        [HttpDelete("hard-delete/{snackId}")]
        public async Task<IActionResult> HardDeleteSnack(int snackId)
        {
            try
            {
                await _snackDeleteService.HardDeleteSnackById(snackId);
                return Ok("Snack hard deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in snackController.HardDeleteSnack: {ex.Message}");
            }
        }
    }
}