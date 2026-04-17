using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Abstract;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Services.Implementations
{
    public class CinemaService : BaseService<Cinema>, ICinemaService
    {
        private new readonly AppDbContext _dbContext;

        public CinemaService(AppDbContext dbContext)
         : base(dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<List<Cinema>> GetAllCinemas() =>
           await _dbContext.Cinemas
               .AsNoTracking()
               .Include(c => c.Location)
               .OrderBy(c => c.cinema_id)
               .ToListAsync();

        public async Task<Cinema?> GetCinemaById(int cinema_id) =>
            await _dbContext.Cinemas
                .AsNoTracking()
                .Include(c => c.Location)
                .FirstOrDefaultAsync(c => c.cinema_id == cinema_id);

        public async Task AddCinema(CinemaCreateRequest request)
        {
            try
            {
                var cinema = new Cinema
                {
                    location_id = request.location_id,
                    name = request.name,
                    address = request.address,
                    phone_number = request.phone_number,
                    latitude = request.latitude,
                    longitude = request.longitude,
                    description = request.description,
                    image_overview = request.image_overview
                };
                _dbContext.Cinemas.Add(cinema);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding cinema: {ex.Message}");
                throw new Exception($"An error occurred while adding the cinema: {ex.Message}");
            }
        }

        public async Task UpdateCinema(int cinema_id, CinemaUpdateRequest request)
        {
            try
            {
                var cinema = await _dbContext.Cinemas.FindAsync(cinema_id);
                if (cinema == null) return;

                cinema.name = request.name;
                cinema.address = request.address;
                cinema.location_id = request.location_id;
                cinema.phone_number = request.phone_number;
                cinema.latitude = request.latitude;
                cinema.longitude = request.longitude;
                cinema.description = request.description;
                cinema.image_overview = request.image_overview;

                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating cinema: {ex.Message}");
                throw new Exception($"An error occurred while updating the cinema: {ex.Message}");
            }
        }
        public async Task SoftDeleteCinema(int cinema_id)
        {
            try
            {
                var cinema = await _dbContext.Cinemas.FirstOrDefaultAsync(c => c.cinema_id == cinema_id);
                if (cinema == null) throw new Exception("Cinema not found");

                await SoftDeleteAsync(cinema);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error soft deleting cinema: {ex.Message}");
                throw new Exception($"An error occurred while deleting the cinema: {ex.Message}");
            }
        }

        public async Task HardDeleteCinema(int cinema_id)
        {
            try
            {
                var cinema = await _dbContext.Cinemas
                    .Include(c => c.Rooms)
                    .Include(c => c.Inventories)
                    .FirstOrDefaultAsync(c => c.cinema_id == cinema_id);

                if (cinema == null) throw new Exception("Cinema not found");

                if (cinema.Rooms.Any() || cinema.Inventories.Any())
                    throw new Exception("Cannot hard delete cinema that already has rooms or inventory records.");

                await HardDeleteAsync(cinema);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error hard deleting cinema: {ex.Message}");
                throw new Exception($"An error occurred while hard deleting the cinema: {ex.Message}");
            }
        }
    }
}

