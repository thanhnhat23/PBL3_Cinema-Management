using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;

namespace CinemaAPI.Services.Interfaces
{
<<<<<<<< HEAD:server/CinemaAPI/services/Interfaces/IService.cs
    public interface IService
========
      public interface ICinemaService
>>>>>>>> 7bd3e0f8d4b8d900de8b97b0c4911b5c79e3d30a:server/CinemaAPI/services/Interfaces/ICinemaService.cs
    {
        // Read
        Task<List<Cinema>> GetAllCinemas();
        Task<Cinema?> GetCinemaById(int cinema_id);
        // Create
        Task AddCinema(CinemaCreateRequest request);
        // Update
        Task UpdateCinema(int cinema_id, CinemaUpdateRequest request);
        // Delete
        Task DeleteCinema(int cinema_id);
    }
}
