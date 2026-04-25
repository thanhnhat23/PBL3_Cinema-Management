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
            await _dbContext.Actors.AsNoTracking().ToListAsync();

        public async Task<Actor?> GetActorByIdAsync(int id) =>
            await _dbContext.Actors.AsNoTracking().FirstOrDefaultAsync(a => a.actor_id == id);

        public async Task<List<MovieWithActor>> GetMovieWithActorAsync(int id) =>
            await _dbContext.MovieActors
                .AsNoTracking()
                .Where(ma => ma.actor_id == id)
                .Include(ma => ma.Movie)
                .Select(ma => new MovieWithActor
                {
                    Movie = ma.Movie
                })
                .ToListAsync();

        public async Task<List<CharacterWithActor>> GetCharacterWithActorAsync(int id) =>
            await _dbContext.MovieActors
                .AsNoTracking()
                .Where(ma => ma.actor_id == id)
                .Select(ma => new CharacterWithActor
                {
                    char_name = ma.char_name
                })
                .ToListAsync();

        public async Task UpdateActorAsync(int id, ActorRequest request)
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
                RagCacheKeys.Invalidate("actors", "movies");
            }
            catch (Exception ex)
            {
                throw new Exception($"Error updating actor: {ex.Message}");
            }
        }
        public async Task DeleteActorAsync(int id)
        {
            try
            {
                var actor = await _dbContext.Actors.FindAsync(id);
                if (actor == null)
                    throw new Exception("Actor not found");

                actor.deleted_at = DateOnly.FromDateTime(DateTime.UtcNow);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in ActorService.DeleteActor: {ex.Message}");
                throw new Exception("An error occurred while deleting the actor.");
            }

        }
    }
}