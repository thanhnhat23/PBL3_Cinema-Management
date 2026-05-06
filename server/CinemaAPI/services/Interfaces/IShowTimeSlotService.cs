using CinemaAPI.Models;

namespace CinemaAPI.Services.Interfaces
{
    public interface IShowTimeSlotService
    {
        Task<List<ShowTimeSlot>> GetAllSlots();
        Task<ShowTimeSlot?> GetSlotById(int slot_id);
        Task AddSlot(ShowTimeSlot slot);
        Task UpdateSlot(int slot_id, CinemaAPI.Models.DTOs.ShowTimeSlotUpdateRequest request);
        Task SoftDeleteSlot(int slot_id);
        Task HardDeleteSlot(int slot_id);
    }
}
