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
        Task SoftDeleteSnackById(int snack_id, Guid? deletedBy);
        Task HardDeleteSnackById(int snack_id);
    }
}