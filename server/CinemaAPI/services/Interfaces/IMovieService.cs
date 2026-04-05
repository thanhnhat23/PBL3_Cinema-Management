using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Models.DTOs.Response;

namespace CinemaAPI.Services.Interfaces
{
    public interface IMovieService
    {
        Task<List<Movie>> GetAllMovies();
        Task<Movie?> GetMovieById(int movie_id);
        Task AddMovie(Movie movie);
        Task UpdateMovie(int movie_id, MovieUpdateRequest request);
        Task DeleteMovie(int movie_id);
        Task<List<ActorWithMovie>> GetActorWithMovieAsync(int id);
    }
}