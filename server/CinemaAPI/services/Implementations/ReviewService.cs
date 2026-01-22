using CinemaAPI.Services.Interfaces;
using CinemaAPI.Models;
using MongoDB.Driver;

public class ReviewService : IReviewService
{
    private readonly IMongoCollection<Review> _reviews;

    public ReviewService(MongoDbContext context)
    {
        _reviews = context.Reviews;
    }

    public async Task<List<Review>> GetReviewsByMovie(int movie_id)
    {
        return await _reviews.Find(r => r.movie_id == movie_id)
                             .SortByDescending(r => r.review_date)
                             .ToListAsync();
    }

    public async Task AddReview(Review review)
    {
        await _reviews.InsertOneAsync(review);
    }

    public async Task<double> GetAverageRating(int movie_id)
    {
        var filter = Builders<Review>.Filter.Eq(r => r.movie_id, movie_id);
        var reviews = await _reviews.Find(filter).ToListAsync();

        if (reviews.Count == 0)
            return 0.0;

        double totalRating = 0;
        foreach (var review in reviews)
        {
            totalRating += review.rating;
        }

        return totalRating / reviews.Count;
    }
}