using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;

namespace CinemaAPI.Services.Interfaces
{
    public interface IMovieActor
    {
        Task<List<MovieActor>> GetAllMovieActors();
        Task<MovieActor?> GetMovieActorById(int movie_actor_id);
        Task AddMovieActor(MovieActor movieActor);
        Task UpdateMovieActor(int movie_actor_id, MovieActorUpdateRequest request);
        Task DeleteMovieActor(int movie_actor_id);
    }
}