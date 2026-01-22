using CinemaAPI.Models;

namespace CinemaAPI.Services.Interfaces
{
    public interface ISnackService
    {
        Task<List<Snack>> GetAllSnacks();
        Task<Snack?> GetSnackById(int snack_id);
        Task AddSnack(Snack snack);
        Task UpdateSnack(int snack_id, Snack updatedSnack);
        Task DeleteSnack(int snack_id);
    }
}