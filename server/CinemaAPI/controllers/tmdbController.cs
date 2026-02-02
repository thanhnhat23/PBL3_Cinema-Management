using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CinemaAPI.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    // localhost:5143/api/v1/movie/sync-genres
    public class tmdbController : ControllerBase
    {
        private readonly ITmdbService _tmdbService;

        public tmdbController(ITmdbService tmdbService)
        {
            _tmdbService = tmdbService;
        }

        [HttpPost("sync-genres")]
        public async Task<IActionResult> SeedGenres()
        {
            try
            {
                await _tmdbService.ISyncGenresAsync();
                return Ok("Genres synchronized successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in tmdbController.SyncGenres: {ex.Message}");
            }
        }

        [HttpPost("sync-movies")]
        public async Task<IActionResult> SyncMovie([FromQuery] string type = "nowplaying")
        {
            if (type != "nowplaying" && type != "upcoming" && type != "popular")
            {
                return BadRequest("Invalid type. Allowed values are 'nowplaying', 'upcoming', or 'popular'.");
            }

            try
            {
                await _tmdbService.SyncMovieAsync(type);
                return Ok("Movies synchronized successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in tmdbController.SyncMovie: {ex.Message}");
            }
        }
    }
}