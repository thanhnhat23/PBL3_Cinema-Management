using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;

namespace CinemaAPI.Services.Implementations
{
    public class ReviewService : IReviewService
    {
        private readonly AppDbContext _dbContext;
        private readonly MongoDbContext _mongoDbContext;

        public ReviewService(AppDbContext dbContext, MongoDbContext mongoDbContext)
        {
            _dbContext = dbContext;
            _mongoDbContext = mongoDbContext;
        }

        public async Task<List<Review>> GetAllReviews() =>
            await _mongoDbContext.Reviews
                .Find(_ => true)
                .SortByDescending(r => r.createAt)
                .ToListAsync();

        public async Task<Review?> GetReviewById(string review_id) =>
            await _mongoDbContext.Reviews
            .Find(r => r.review_id == review_id)
            .FirstOrDefaultAsync();

        public async Task<List<Review>> GetReviewsByMovieId(int movie_id) =>
            await _mongoDbContext.Reviews
                .Find(r => r.movie_id == movie_id)
                .SortByDescending(r => r.createAt)
                .ToListAsync();

        public async Task AddReview(ReviewCreateRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.content))
                throw new Exception("Review content is required.");

            if (request.rating < 0 || request.rating > 10)
                throw new Exception("Rating must be between 0 and 10.");

            var user = await _dbContext.Users.AsNoTracking().FirstOrDefaultAsync(u => u.user_id == request.user_id);
            if (user == null)
                throw new Exception($"User with ID {request.user_id} not found.");

            var movieExists = await _dbContext.Movies.AsNoTracking().AnyAsync(m => m.movie_id == request.movie_id);
            if (!movieExists)
                throw new Exception($"Movie with ID {request.movie_id} not found.");

            var review = new Review
            {
                user_id = user.user_id,
                movie_id = request.movie_id,
                username = user.userName,
                profile_slug = user.user_id.ToString(),
                avatar_provider = "local",
                avatar_path = user.avatar_path,
                comment = request.content,
                rating = request.rating,
                isApproved = true,
                spoilerFlag = false,
                createAt = DateTime.UtcNow,
                updatedAt = DateTime.UtcNow
            };

            await _mongoDbContext.Reviews.InsertOneAsync(review);

            try
            {
                var updateCount = await _dbContext.Movies
                    .Where(m => m.movie_id == request.movie_id)
                    .ExecuteUpdateAsync(setters => setters.SetProperty(m => m.vote_count, m => m.vote_count + 1));

                if (updateCount == 0)
                    throw new Exception($"Movie with ID {request.movie_id} not found.");
            }
            catch
            {
                if (!string.IsNullOrWhiteSpace(review.review_id))
                {
                    await _mongoDbContext.Reviews.DeleteOneAsync(r => r.review_id == review.review_id);
                }

                throw;
            }

            RagCacheKeys.Invalidate("movies");
        }

        public async Task UpdateReview(string review_id, ReviewUpdateRequest request)
        {
            var updates = new List<UpdateDefinition<Review>>();

            if (!string.IsNullOrWhiteSpace(request.content))
            {
                updates.Add(Builders<Review>.Update.Set(r => r.comment, request.content));
            }

            if (request.rating.HasValue)
            {
                if (request.rating.Value < 0 || request.rating.Value > 10)
                    throw new Exception("Rating must be between 0 and 10.");

                updates.Add(Builders<Review>.Update.Set(r => r.rating, request.rating.Value));
            }

            if (updates.Count == 0)
                return;

            updates.Add(Builders<Review>.Update.Set(r => r.updatedAt, DateTime.UtcNow));

            var result = await _mongoDbContext.Reviews.UpdateOneAsync(
                r => r.review_id == review_id,
                Builders<Review>.Update.Combine(updates)
            );

            if (result.MatchedCount == 0)
                throw new Exception($"Review with ID {review_id} not found.");
        }

        public async Task BannedReview(string review_id)
        {
            var result = await _mongoDbContext.Reviews.UpdateOneAsync(
                r => r.review_id == review_id,
                Builders<Review>.Update
                    .Set(r => r.isApproved, false)
                    .Set(r => r.updatedAt, DateTime.UtcNow)
            );

            if (result.MatchedCount == 0)
                throw new Exception($"Review with ID {review_id} not found.");
        }
    }
}