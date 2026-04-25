using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Models.DTOs.Response;

namespace CinemaAPI.Services.Interfaces
{
    public interface IActorService
    {
        Task<List<Actor>> GetAllActorsAsync();
        Task<Actor?> GetActorByIdAsync(int id);
        Task<List<MovieWithActor>> GetMovieWithActorAsync(int id);
        Task<List<CharacterWithActor>> GetCharacterWithActorAsync(int id);
        Task UpdateActorAsync(int id, ActorRequest request);
        Task DeleteActorAsync(int id);
    }
}