using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;

namespace CinemaAPI.Services.Interfaces
{
    public interface IShowTimeService
    {
        Task<List<ShowTime>> GetAllShowTimes();
        Task<ShowTime?> GetShowTimeById(int show_time_id);
        Task AddShowTime(ShowTime showTime);
        Task UpdateShowTime(int show_time_id, ShowTimeRequest request);
        Task DeleteShowTime(int show_time_id);
    }
}