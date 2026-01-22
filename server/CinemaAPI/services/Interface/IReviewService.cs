using CinemaAPI.Models;

namespace CinemaAPI.Services.Interfaces
{
    public interface IReviewService
    {
        Task<List<Review>> GetReviewsByMovie(int movie_id);
        Task AddReview(Review review);
        Task<double> GetAverageRating(int movie_id);
    }
}