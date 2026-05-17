using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;

namespace CinemaAPI.Services.Interfaces
{
    public interface ICinemaService
    {
        // Read
        Task<List<Cinema>> GetAllCinemas();
        Task<Cinema?> GetCinemaById(int cinema_id);
        // Create
        Task AddCinema(CinemaCreateRequest request);
        // Update
        Task UpdateCinema(int cinema_id, CinemaUpdateRequest request);
        // Delete
        Task SoftDeleteCinema(int cinema_id, Guid? deletedBy);
        Task HardDeleteCinema(int cinema_id);
    }
}
