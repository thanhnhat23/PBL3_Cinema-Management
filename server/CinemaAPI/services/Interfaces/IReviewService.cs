using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;

namespace CinemaAPI.Services.Interfaces
{
    public interface IReviewService
    {
        Task<List<Review>> GetAllReviews();
        Task<Review?> GetReviewById(string review_id);
        Task<List<Review>> GetReviewsByMovieId(int movie_id);
        Task AddReview(ReviewCreateRequest request);
        Task UpdateReview(string review_id, ReviewUpdateRequest request);
        Task BannedReview(string review_id);
    }
}