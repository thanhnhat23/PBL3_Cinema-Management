using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Services.Implementations
{
    public class MovieActorService : IMovieActorService
    {
        private readonly AppDbContext _dbContext;

        public MovieActorService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<MovieActor>> GetAllMovieActors() =>
            await _dbContext.MovieActors
                .Include(ma => ma.Movie)
                .Include(ma => ma.Actor)
                .ToListAsync();

        public async Task<MovieActor?> GetMovieActorById(int movie_actor_id) =>
            await _dbContext.MovieActors
                .Include(ma => ma.Movie)
                .Include(ma => ma.Actor)
                .FirstOrDefaultAsync(ma => ma.movie_actor_id == movie_actor_id);

        public async Task AddMovieActor(MovieActor movieActor)
        {
            _dbContext.MovieActors.Add(movieActor);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateMovieActor(int movie_actor_id, MovieActorUpdateRequest request)
        {
            var movieActor = await _dbContext.MovieActors.FindAsync(movie_actor_id);

            if (movieActor == null)
                throw new Exception("MovieActor not found");

            try
            {
                if (request.role != null)
                    movieActor.role = request.role;

                if (request.character_name != null)
                    movieActor.character_name = request.character_name;

                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error updating MovieActor: " + ex.Message);
            }
        }

        public async Task DeleteMovieActor(int movie_actor_id)
        {
            var movieActor = await _dbContext.MovieActors.FindAsync(movie_actor_id);

            if (movieActor == null)
                throw new Exception("MovieActor not found");

            try
            {
                _dbContext.MovieActors.Remove(movieActor);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error deleting MovieActor: " + ex.Message);
            }
        }
    }
}