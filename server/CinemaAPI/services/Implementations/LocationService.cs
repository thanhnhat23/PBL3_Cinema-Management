using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Abstract;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Services.Interfaces
{
    public class LocationService : BaseService<Location>, ILocationService
    {
        private new readonly AppDbContext _dbContext;

        public LocationService(AppDbContext dbContext)
            : base(dbContext)
        {
            _dbContext = dbContext;
        }

        // Get all locations
        public async Task<List<Location>> GetAllLocations() =>
            await _dbContext.Locations.ToListAsync();

        // Get location by ID
        public async Task<List<Location?>> GetLocationById(int location_id) =>
            await _dbContext.Locations.Where(l => l.location_id == location_id).ToListAsync();

        public async Task AddLocation(Location location)
        {
            try
            {
                _dbContext.Locations.Add(location);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error adding location: {ex.Message}");
                throw new Exception("An error in location add ", ex);
            }
        }

        public async Task UpdateLocation(int location_id, Location location)
        {
            try
            {
                var locations = await _dbContext.Locations.FindAsync(location_id);
                if (locations != null)
                {
                    locations.city = location.city;

                    await _dbContext.SaveChangesAsync();
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating location: {ex.Message}");
                throw new Exception("An error in location update ", ex);
            }

        }

        public async Task SoftDeleteLocation(int location_id)
        {
            try
            {
                var location = await _dbContext.Locations.FindAsync(location_id);
                if (location != null)
                {
                    await SoftDeleteAsync(location);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting location: {ex.Message}");
                throw new Exception("An error in location delete ", ex);
            }
        }

        public async Task HardDeleteLocation(int location_id)
        {
            try
            {
                var location = await _dbContext.Locations
                    .Include(l => l.Cinemas)
                    .FirstOrDefaultAsync(l => l.location_id == location_id);

                if (location == null)
                    throw new Exception("Location not found");

                if (location.Cinemas.Any())
                    throw new Exception("Cannot hard delete location that still has cinemas.");

                await HardDeleteAsync(location);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error hard deleting location: {ex.Message}");
                throw new Exception("An error in location hard delete ", ex);
            }
        }

    }
}