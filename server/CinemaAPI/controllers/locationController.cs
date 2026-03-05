using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CinemaAPI.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class locationController : ControllerBase
    {
        private readonly ILocationService _locationService;

        public locationController(ILocationService locationService)
        {
            _locationService = locationService;
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllLocations()
        {
            try
            {
                var locations = await _locationService.GetAllLocations();
                return Ok(locations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in locationController.GetAllLocations: {ex.Message}");
            }
        }

        [HttpGet("get/{locationId}")]
        public async Task<IActionResult> GetLocation(int locationId)
        {
            try
            {
                var location = await _locationService.GetLocationById(locationId);
                if (location == null)
                    return NotFound("Location not found");

                return Ok(location);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in locationController.GetLocation: {ex.Message}");
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateLocation([FromBody] Location request)
        {
            try
            {
                var location = new Location
                {
                    city = request.city,
                    
                };

                await _locationService.AddLocation(location);
                return Ok("Location created successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in locationController.CreateLocation: {ex.Message}");
            }
        }

        [HttpPut("update/{locationId}")]
        public async Task<IActionResult> UpdateLocation(int locationId, [FromBody] Location request)
        {
            try
            {
                var location = new Location
                {
                    city = request.city,
                    
                };

                await _locationService.UpdateLocation(locationId, location);
                return Ok("Location updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in locationController.UpdateLocation: {ex.Message}");
            }
        }

        [HttpDelete("delete/{locationId}")]
        public async Task<IActionResult> DeleteLocation(int locationId)
        {
            try
            {
                await _locationService.DeleteLocation(locationId);
                return Ok("Location deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in locationController.DeleteLocation: {ex.Message}");
            }
        }
    }
}
