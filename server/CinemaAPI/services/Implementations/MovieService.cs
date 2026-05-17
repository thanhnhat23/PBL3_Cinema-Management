using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Models.DTOs.Response;
using CinemaAPI.Services.Abstract;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Services.Implementations
{
    public class MovieService : BaseService<Movie>, IMovieService
    {
        private new readonly AppDbContext _dbContext;

        public MovieService(AppDbContext dbContext)
            : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Movie>> GetAllMovies() =>
            await _dbContext.Movies
                .AsNoTracking()
                .Include(m => m.MovieGenres)
                    .ThenInclude(mg => mg.Genre)
                .Include(m => m.MovieActors)
                    .ThenInclude(ma => ma.Actor)
                .OrderByDescending(m => m.release_date)
                .ToListAsync();

        public async Task<Movie?> GetMovieById(int movie_id) =>
            await _dbContext.Movies
            .AsNoTracking()
            .Include(m => m.MovieGenres)
                .ThenInclude(mg => mg.Genre)
            .Include(m => m.MovieActors)
                .ThenInclude(ma => ma.Actor)
            .Include(m => m.ShowTimes)
            .FirstOrDefaultAsync(m => m.movie_id == movie_id);

        public async Task<List<Movie>> GetMoviesByGenreAsync(int genreId, int limit) =>
            await _dbContext.Movies
                .AsNoTracking()
                .Where(m => m.MovieGenres.Any(mg => mg.genre_id == genreId))
                .OrderByDescending(m => m.release_date)
                .Take(limit)
                .ToListAsync();

        public async Task<List<Movie>> GetMoviesByStatusAsync(int status, int limit) =>
            await _dbContext.Movies
                .AsNoTracking()
                .Where(m => m.status == (MovieStatus)status)
                .OrderByDescending(m => m.release_date)
                .Take(limit)
                .ToListAsync();

        public async Task<List<Movie>> GetPopularMoviesAsync(int limit) =>
            await _dbContext.Movies
                .AsNoTracking()
                .OrderByDescending(movie => movie.vote_average)
                .ThenByDescending(movie => movie.release_date)
                .Take(limit)
                .ToListAsync();


        public async Task<Movie> UpdateMovie(int movie_id, MovieUpdateRequest request)
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

                if (request.adult.HasValue)
                    movie.adult = request.adult.Value;

                if (request.runtime.HasValue)
                    movie.runtime = request.runtime.Value;

                if (request.status.HasValue)
                    movie.status = request.status.Value;

                await _dbContext.SaveChangesAsync();
                RagCacheKeys.Invalidate("movies");
                return movie;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"UpdateMovie Error: {ex.Message}");
                throw new Exception($"An error occurred while updating the movie: {ex.Message}");
            }
        }

        public async Task SoftDeleteMovie(int movie_id)
        {
            var movie = await _dbContext.Movies.FindAsync(movie_id);
            if (movie == null)
                throw new Exception("Movie not found.");

            await SoftDeleteAsync(movie);
            RagCacheKeys.Invalidate("movies");
        }

        public async Task HardDeleteMovie(int movie_id)
        {
            try
            {
                var movie = await _dbContext.Movies
                    .Include(m => m.ShowTimes)
                    .FirstOrDefaultAsync(m => m.movie_id == movie_id);

                if (movie == null)
                    throw new Exception("Movie not found");

                if (movie.ShowTimes.Any())
                    throw new Exception("Cannot hard delete movie that already has showtimes.");

                await HardDeleteAsync(movie);
                RagCacheKeys.Invalidate("movies");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"HardDeleteMovie Error: {ex.Message}");
                throw new Exception($"An error occurred while hard deleting the movie: {ex.Message}");
            }
        }

        public async Task<List<ActorWithMovie>> GetActorWithMovieAsync(int id) =>
            await _dbContext.MovieActors
                .AsNoTracking()
                .Where(ma => ma.movie_id == id)
                .Include(ma => ma.Actor)
                .Select(ma => new ActorWithMovie
                {
                    Actor = ma.Actor,
                    char_name = ma.char_name,
                    order = ma.order
                })
                .ToListAsync();
    }
}