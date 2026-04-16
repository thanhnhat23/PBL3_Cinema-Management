using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using MongoDB.Driver;

namespace CinemaAPI.Services.Implementations
{
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _dbContext;
        private readonly MongoDbContext _mongoDbContext;

        public AdminService(AppDbContext dbContext, MongoDbContext mongoDbContext)
        {
            _dbContext = dbContext;
            _mongoDbContext = mongoDbContext;
        }

        public async Task<int> GetTotalMoviesAsync() =>
            await _dbContext.Movies.AsNoTracking().CountAsync();

        public async Task<int> GetTotalActorsAsync() =>
            await _dbContext.Actors.AsNoTracking().CountAsync();

        public async Task<int> GetTotalGenresAsync() =>
            await _dbContext.Genres.AsNoTracking().CountAsync();

        public async Task<int> GetTotalReviewsAsync() =>
            (int)await _mongoDbContext.Reviews.CountDocumentsAsync(FilterDefinition<Review>.Empty);

        public async Task<List<MovieStatusCountResponse>> GetTotalMoviesByStatusAsync()
        {
            var statusCounts = await _dbContext.Movies
                .AsNoTracking()
                .GroupBy(movie => movie.status)
                .Select(group => new
                {
                    Status = group.Key,
                    Total = group.Count()
                })
                .ToListAsync();

            var statusCountMap = statusCounts.ToDictionary(item => item.Status, item => item.Total);

            var orderedStatuses = new[]
            {
                MovieStatus.Released,
                MovieStatus.Upcoming,
                MovieStatus.Ended
            };

            return orderedStatuses
                .Select(status => new MovieStatusCountResponse
                {
                    status = status.ToString().ToLowerInvariant(),
                    total = statusCountMap.GetValueOrDefault(status, 0)
                })
                .ToList();
        }

        public async Task<List<MovieMonthlyCountResponse>> GetTotalMoviesByMonthAsync()
        {
            var currentYear = DateTime.UtcNow.Year;
            var monthNames = new[]
            {
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            };

            var monthCounts = await _dbContext.Movies
                .AsNoTracking()
                .Where(movie => movie.release_date.HasValue && movie.release_date.Value.Year == currentYear)
                .GroupBy(movie => movie.release_date!.Value.Month)
                .Select(group => new
                {
                    Month = group.Key,
                    Total = group.Count()
                })
                .ToListAsync();

            var monthCountMap = monthCounts.ToDictionary(item => item.Month, item => item.Total);

            return Enumerable.Range(1, 12)
                .Select(month => new MovieMonthlyCountResponse
                {
                    month = month,
                    monthName = monthNames[month - 1],
                    total = monthCountMap.GetValueOrDefault(month, 0)
                })
                .ToList();
        }

        public async Task<List<MovieGenreCountResponse>> GetTotalMoviesByGenreAsync() =>
            await _dbContext.Genres
                .AsNoTracking()
                .Select(genre => new MovieGenreCountResponse
                {
                    genreId = genre.genre_id,
                    genre = genre.name,
                    movie = genre.MovieGenres.Count
                })
                .OrderByDescending(item => item.movie)
                .ToListAsync();

        public async Task<List<User>> GetAdminsAsync() =>
            await _dbContext.Users
                .AsNoTracking()
                .Where(user => user.role == UserType.Admin)
                .ToListAsync();
    }
}