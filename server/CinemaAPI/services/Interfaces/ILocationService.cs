using CinemaAPI.Models;
using CinemaAPI.Services;

namespace CinemaAPI.Services.Interfaces
{
    public interface ILocationService
    {
        Task<List<Location>> GetAllLocations();
        Task<Location?> GetLocationById(int location_id);
        Task AddLocation(Location location);
        Task UpdateLocation(int location_id, Location location);
    }

}