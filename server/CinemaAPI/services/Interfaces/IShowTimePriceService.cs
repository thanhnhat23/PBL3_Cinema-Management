using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;

namespace CinemaAPI.Services.Interfaces
{
    public interface IShowTimePriceService
    {
        Task<List<ShowTimePrice>> GetAllPrices();
        Task<ShowTimePrice?> GetPrice(int type_id, int slot_id);
        Task AddPrice(ShowTimePrice price);
        Task UpdatePrice(int type_id, int slot_id, ShowTimePriceUpdateRequest request);
        Task DeletePrice(int type_id, int slot_id);
    }
}
