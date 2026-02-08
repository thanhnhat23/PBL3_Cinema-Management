using CinemaAPI.Models;
using CCinemaAPI.Models.DTOs;

namespace CinemaAPI.Services.Interfaces
{
    public interface IMovieGenreService
    {
        Task<List<MovieGenre>> GetAllMovieGenres();
        Task<MovieGenre?> GetMovieGenreById(int movie_genre_id);
        Task AddMovieGenre(MovieGenre movieGenre);
        Task UpdateMovieGenre(int movie_genre_id, MovieGenreRequest request);
        Task DeleteMovieGenre(int movie_genre_id);
    }
}
