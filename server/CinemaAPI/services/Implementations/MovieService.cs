using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Services.Implementations
{
    public class MovieService : IMovieService
    {
        private readonly AppDbContext _dbContext;

        public MovieService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Movie>> GetAllMovies() =>
            await _dbContext.Movies
                .Include(m => m.MovieGenres)
                    .ThenInclude(mg => mg.Genre)
                .Include(m => m.MovieActors)
                    .ThenInclude(ma => ma.Actor)
                .ToListAsync();
                
        public async Task<Movie?> GetMovieById(int movie_id) =>
            await _dbContext.Movies
            .Include(m => m.MovieGenres)
                .ThenInclude(mg => mg.Genre)
            .Include(m => m.MovieActors)
                .ThenInclude(ma => ma.Actor)
            .Include(m => m.ShowTimes)
            .FirstOrDefaultAsync(m => m.movie_id == movie_id);

        public async Task AddMovie(Movie movie)
        {
            _dbContext.Movies.Add(movie);
            await _dbContext.SaveChangesAsync();
        }
        
        public async Task UpdateMovie(int movie_id, MovieUpdateRequest request)
        {
            var movie = await _dbContext.Movies.FindAsync(movie_id);

            if (movie == null)
                throw new Exception("Movie not found");

            try
            {
                if (request.title != null)
                    movie.title = request.title;

                if (request.overview != null)
                    movie.overview = request.overview;

                if (request.release_date.HasValue)
                    movie.release_date = request.release_date.Value;

                if (request.end_date.HasValue)
                    movie.end_date = request.end_date.Value;

                if (request.status.HasValue)
                    movie.status = request.status.Value;

                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"UpdateMovie Error: {ex.Message}");
                throw new Exception($"An error occurred while updating the movie: {ex.Message}");
            }
        }

        public async Task DeleteMovie(int movie_id)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                var movie = await _dbContext.Movies
                    .Include(m => m.MovieGenres)
                    .Include(m => m.MovieActors)
                    .Include(m => m.ShowTimes)
                    .FirstOrDefaultAsync(m => m.movie_id == movie_id);

                if (movie == null) throw new Exception("Movie not found.");

                if (movie.ShowTimes.Any())
                    throw new Exception("Cannot delete a movie that has showtimes. Please delete showtimes first.");

                if (movie.MovieGenres.Any())
                    _dbContext.MovieGenres.RemoveRange(movie.MovieGenres);

                if (movie.MovieActors.Any())
                    _dbContext.MovieActors.RemoveRange(movie.MovieActors);

                _dbContext.Movies.Remove(movie);

                await _dbContext.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"DeleteMovie Error: {ex.Message}");
                throw new Exception($"An error occurred while deleting the movie: {ex.Message}");
            }
        }
    }
}