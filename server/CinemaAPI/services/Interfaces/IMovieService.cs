using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Models.DTOs.Response;

namespace CinemaAPI.Services.Interfaces
{
    public interface IMovieService
    {
        Task<List<Movie>> GetAllMovies();
        Task<List<Movie>> GetMoviesByStatusAsync(int status, int limit);
        Task<List<Movie>> GetPopularMoviesAsync(int limit);
        Task<Movie?> GetMovieById(int movie_id);
        Task AddMovie(Movie movie);
        Task<Movie> UpdateMovie(int movie_id, MovieUpdateRequest request);
        Task<List<ActorWithMovie>> GetActorWithMovieAsync(int id);
    }
}