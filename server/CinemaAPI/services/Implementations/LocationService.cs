using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Services.Interfaces
{
    public class LocationService : ILocationService
    {
        private readonly AppDbContext _dbContext;

        public LocationService(AppDbContext dbContext)
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
            } catch (Exception ex)
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

        public async Task DeleteLocation(int location_id)
        {
            try
            {
                var location = await _dbContext.Locations.FindAsync(location_id);
                if (location == null)
                    throw new Exception("Location not found");
                location.deleted_at = DateOnly.FromDateTime(DateTime.UtcNow);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting location: {ex.Message}");
                throw new Exception("An error in location delete ", ex);
            }
        }
    }
}