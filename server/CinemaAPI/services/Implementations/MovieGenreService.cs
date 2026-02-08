using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Services.Implementations
{
    public class MovieGenreService : IMovieGenreService
    {
        private readonly AppDbContext _dbContext;

        public MovieGenreService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<MovieGenre>> GetAllMovieGenres() =>
            await _dbContext.MovieGenres
                .Include(mg => mg.Movie)
                .Include(mg => mg.Genre)
                .ToListAsync();

        public async Task<MovieGenre?> GetMovieGenreById(int movie_genre_id) =>
            await _dbContext.MovieGenres
                .Include(mg => mg.Movie)
                .Include(mg => mg.Genre)
                .FirstOrDefaultAsync(mg => mg.movie_genre_id == movie_genre_id);

        public async Task AddMovieGenre(MovieGenre movieGenre)
        {
            _dbContext.MovieGenres.Add(movieGenre);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateMovieGenre(int movie_genre_id, MovieGenreRequest request)
        {
            var movieGenre = await _dbContext.MovieGenres.FindAsync(movie_genre_id);

            if (movieGenre == null)
                throw new Exception("MovieGenre not found");

            try
            {
                if (request.movie_id.HasValue)
                    movieGenre.movie_id = request.movie_id.Value;

                if (request.genre_id.HasValue)
                    movieGenre.genre_id = request.genre_id.Value;

                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error updating MovieGenre: " + ex.Message);
            }
        }

        public async Task DeleteMovieGenre(int movie_genre_id)
        {
            var movieGenre = await _dbContext.MovieGenres.FindAsync(movie_genre_id);

            if (movieGenre == null)
                throw new Exception("MovieGenre not found");

            _dbContext.MovieGenres.Remove(movieGenre);
            await _dbContext.SaveChangesAsync();
        }
    }
}