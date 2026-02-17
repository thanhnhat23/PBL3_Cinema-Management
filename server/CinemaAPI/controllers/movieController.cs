using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CinemaAPI.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class movieController : ControllerBase
    {
        private readonly IMovieService _movieService;

        public movieController(IMovieService movieService)
        {
            _movieService = movieService;
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllMovies()
        {
            try
            {
                var movies = await _movieService.GetAllMovies();
                return Ok(movies);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in movieController.GetAllMovies: {ex.Message}");
            }
        }

        [HttpGet("get/{movieId}")]
        public async Task<IActionResult> GetMovieById(int movieId)
        {
            try
            {
                var movie = await _movieService.GetMovieById(movieId);
                if (movie == null)
                    return NotFound("Movie not found");

                return Ok(movie);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in movieController.GetMovieById: {ex.Message}");
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> AddMovie([FromBody] Movie movie)
        {
            try
            {
                await _movieService.AddMovie(movie);
                return Ok("Movie created successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in movieController.AddMovie: {ex.Message}");
            }
        }

        [HttpPut("update/{movieId}")]
        public async Task<IActionResult> UpdateMovie(int movieId, [FromBody] MovieUpdateRequest request)
        {
            try
            {
                await _movieService.UpdateMovie(movieId, request);
                return Ok("Movie updated successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in movieController.UpdateMovie: {ex.Message}");
            }
        }

        [HttpDelete("delete/{movieId}")]
        public async Task<IActionResult> DeleteMovie(int movieId)
        {
            try
            {
                await _movieService.DeleteMovie(movieId);
                return Ok("Movie deleted successfully");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in movieController.DeleteMovie: {ex.Message}");
            }
        }
    }
}