using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Implementations;
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

        [HttpGet("get-by-status")]
        public async Task<IActionResult> GetMoviesByStatus([FromQuery] int status, [FromQuery] int limit = 10)
        {
            try
            {
                var movies = await _movieService.GetMoviesByStatusAsync(status, limit);
                return Ok(movies);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in movieController.GetMoviesByStatus: {ex.Message}");
            }
        }

        [HttpGet("get-by-genre")]
        public async Task<IActionResult> GetMoviesByGenre([FromQuery] int genreId, [FromQuery] int limit = 1000)
        {
            try
            {
                if (genreId <= 0)
                    return BadRequest("genreId must be greater than 0.");

                if (limit <= 0)
                    return BadRequest("limit must be greater than 0.");

                var movies = await _movieService.GetMoviesByGenreAsync(genreId, limit);
                return Ok(movies);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in movieController.GetMoviesByGenre: {ex.Message}");
            }
        }

        [HttpGet("get-popular")]
        public async Task<IActionResult> GetPopularMovies([FromQuery] int limit = 10)
        {
            try
            {
                var movies = await _movieService.GetPopularMoviesAsync(limit);
                return Ok(movies);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in movieController.GetPopularMovies: {ex.Message}");
            }
        }
        
        [HttpPut("update/{movieId}")]
        public async Task<IActionResult> UpdateMovie(int movieId, [FromBody] MovieUpdateRequest request)
        {
            try
            {
                var movie = await _movieService.UpdateMovie(movieId, request);
                return Ok(new { data = movie, message = "Movie updated successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in movieController.UpdateMovie: {ex.Message}");
            }
        }

        [HttpGet("get-actor-with-movies/{id}")]
        public async Task<IActionResult> GetActorWithMovie(int id)
        {
            try
            {
                var movie = await _movieService.GetActorWithMovieAsync(id);
                if (movie == null)
                    return NotFound("Movie not found on actor");

                return Ok(movie);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in movieController.GetActorWithMovie: {ex.Message}");
            }
        }
    }
}