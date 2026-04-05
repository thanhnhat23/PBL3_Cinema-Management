using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Models.DTOs.Response;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Services.Implementations
{
    public class ActorService : IActorService
    {
        private readonly AppDbContext _dbContext;

        public ActorService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Actor>> GetAllActorsAsync() =>
            await _dbContext.Actors.ToListAsync();

        public async Task<Actor?> GetActorByIdAsync(int id) =>
            await _dbContext.Actors.FindAsync(id);

        public async Task<List<MovieWithActor>> GetMovieWithActorAsync(int id) =>
            await _dbContext.MovieActors
                .Where(ma => ma.actor_id == id)
                .Include(ma => ma.Movie)
                .Select(ma => new MovieWithActor
                {
                    Movie = ma.Movie
                })
                .ToListAsync();

        public async Task<List<CharacterWithActor>> GetCharacterWithActorAsync(int id) =>
            await _dbContext.MovieActors
                .Where(ma => ma.actor_id == id)
                .Select(ma => new CharacterWithActor
                {
                    char_name = ma.char_name
                })
                .ToListAsync();

        public async Task UpdateActorAsync(int id, ActorDetailRequest request)
        {
            var actor = await _dbContext.Actors.FindAsync(id);

            if (actor == null)
                throw new Exception("Actor not found");

            try
            {
                if (request.biography != null)
                    actor.biography = request.biography;

                if (request.birthday.HasValue)
                    actor.birthday = request.birthday.Value;

                if (request.place_of_birth != null)
                    actor.place_of_birth = request.place_of_birth;

                _dbContext.Actors.Update(actor);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating actor: {ex.Message}");
            }
        }
    }
}