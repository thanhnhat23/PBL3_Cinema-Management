using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;

namespace CinemaAPI.Services.Interfaces
{
    public interface ISnackService
    {
        Task<List<Snack>> GetAllSnacks();
        Task<Snack?> GetSnackById(int snack_id);
        Task AddSnack(Snack snack);     
        Task UpdateSnack(int snack_id, SnackUpdateRequest request);
        Task DeleteSnackById(int snack_id);
    }
}