using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CinemaAPI.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]
    public class reviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public reviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllReviews()
        {
            try
            {
                var reviews = await _reviewService.GetAllReviews();
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in reviewController.GetAllReviews: {ex.Message}");
            }
        }

        [HttpGet("get/{review_id}")]
        public async Task<IActionResult> GetReviewById(string review_id)
        {
            try
            {
                var review = await _reviewService.GetReviewById(review_id);
                if (review == null)
                    return NotFound("Review not found");

                return Ok(review);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in reviewController.GetReviewById: {ex.Message}");
            }
        }

        [HttpGet("get-reviews-by-movie/{movie_id}")]
        public async Task<IActionResult> GetReviewsByMovieId(int movie_id)
        {
            try
            {
                var reviews = await _reviewService.GetReviewsByMovieId(movie_id);
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in reviewController.GetReviewsByMovieId: {ex.Message}");
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateReview([FromBody] ReviewCreateRequest request)
        {
            try
            {
                await _reviewService.AddReview(request);
                return Ok("Review created successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred in reviewController.CreateReview: {ex.Message}");
            }
        }

        [HttpPut("update/{review_id}")]
        public async Task<IActionResult> UpdateReview(string review_id, [FromBody] ReviewUpdateRequest request)
        {
            try
            {
                await _reviewService.UpdateReview(review_id, request);
                return Ok("Review updated successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred in reviewController.UpdateReview: {ex.Message}");
            }
        }

        [HttpPut("ban/{review_id}")]
        public async Task<IActionResult> BannedReview(string review_id)
        {
            try
            {
                await _reviewService.BannedReview(review_id);
                return Ok("Review banned successfully.");
            }
            catch (Exception ex)
            {
                return BadRequest($"An error occurred in reviewController.BannedReview: {ex.Message}");
            }
        }
    }
}
