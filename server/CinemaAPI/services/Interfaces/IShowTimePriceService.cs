using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;

namespace CinemaAPI.Services.Interfaces
{
    public interface IShowTimePriceService
    {
        Task<List<ShowTimePrice>> GetAllShowTimePrices();
        Task<ShowTimePrice?> GetShowTimePriceById(int show_time_price_id);
        Task AddShowTimePrice(ShowTimePrice showTimePrice);
        Task UpdateShowTimePrice(int show_time_price_id, ShowTimePriceRequest request);
        Task DeleteShowTimePrice(int show_time_price_id);
    }
}