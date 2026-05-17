using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;

namespace CinemaAPI.Services.Interfaces
{
    public interface IShowTimeService
    {
        Task<List<ShowTime>> GetAllShowTimes();
        Task<ShowTime?> GetShowTimeById(int showtime_id);
        Task AddShowTime(ShowTime showTime);
        Task<ShowTime> CreateShowTimeFromSlotAsync(ShowTimeFromSlotRequest request);
        Task UpdateShowTime(int showtime_id, ShowTimeUpdateRequest request);
        Task SoftDeleteShowTime(int showtime_id, Guid? deletedBy);
        Task HardDeleteShowTime(int showtime_id);
        Task<decimal?> GetEffectiveSeatPrice(int showtime_id, int seat_id);
    }
}
