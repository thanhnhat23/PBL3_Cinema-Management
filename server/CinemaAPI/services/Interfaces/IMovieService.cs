using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;

namespace CinemaAPI.Services.Interfaces
{
    public interface IMovieService
    {
        Task<List<Movie>> GetAllMovies();
        Task<Movie?> GetMovieById(int movie_id);
        Task AddMovie(Movie movie);
        Task UpdateMovie(int movie_id, MovieUpdateRequest request);
        Task DeleteMovie(int movie_id);
    }
}