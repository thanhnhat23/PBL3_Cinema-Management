using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CinemaAPI.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class adminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public adminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("get-total-movies")]
        public async Task<IActionResult> GetTotalMovies()
        {
            try
            {
                var totalMovies = await _adminService.GetTotalMoviesAsync();
                return Ok(totalMovies);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in adminController.GetTotalMovies: {ex.Message}");
            }
        }

        [HttpGet("get-total-reviews")]
        public async Task<IActionResult> GetTotalReviews()
        {
            try
            {
                var totalReviews = await _adminService.GetTotalReviewsAsync();
                return Ok(totalReviews);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in adminController.GetTotalReviews: {ex.Message}");
            }
        }

        [HttpGet("get-total-actors")]
        public async Task<IActionResult> GetTotalActors()
        {
            try
            {
                var totalActors = await _adminService.GetTotalActorsAsync();
                return Ok(totalActors);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in adminController.GetTotalActors: {ex.Message}");
            }
        }

        [HttpGet("get-total-genres")]
        public async Task<IActionResult> GetTotalGenres()
        {
            try
            {
                var totalGenres = await _adminService.GetTotalGenresAsync();
                return Ok(totalGenres);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in adminController.GetTotalGenres: {ex.Message}");
            }
        }

        [HttpGet("get-total-status")]
        public async Task<IActionResult> GetTotalMoviesByStatus()
        {
            try
            {
                var statusCounts = await _adminService.GetTotalMoviesByStatusAsync();
                return Ok(statusCounts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in adminController.GetTotalMoviesByStatus: {ex.Message}");
            }
        }

        [HttpGet("get-total-movies-by-month")]
        public async Task<IActionResult> GetTotalMoviesByMonth()
        {
            try
            {
                var monthCounts = await _adminService.GetTotalMoviesByMonthAsync();
                return Ok(monthCounts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in adminController.GetTotalMoviesByMonth: {ex.Message}");
            }
        }

        [HttpGet("get-total-movies-by-genre")]
        public async Task<IActionResult> GetTotalMoviesByGenre()
        {
            try
            {
                var genreCounts = await _adminService.GetTotalMoviesByGenreAsync();
                return Ok(genreCounts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in adminController.GetTotalMoviesByGenre: {ex.Message}");
            }
        }
    }
}