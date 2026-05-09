using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Services.Implementations
{
    public class ShowTimePriceService : IShowTimePriceService
    {
        private readonly AppDbContext _dbContext;

        public ShowTimePriceService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<ShowTimePrice>> GetAllPrices() =>
            await _dbContext.ShowTimePrices
                .AsNoTracking()
                .Include(p => p.SeatType)
                .Include(p => p.ShowTimeSlot)
                .ToListAsync();

        public async Task<ShowTimePrice?> GetPrice(int type_id, int slot_id) =>
            await _dbContext.ShowTimePrices
                .AsNoTracking()
                .Include(p => p.SeatType)
                .Include(p => p.ShowTimeSlot)
                .FirstOrDefaultAsync(p => p.type_id == type_id && p.slot_id == slot_id);

        public async Task AddPrice(ShowTimePrice price)
        {
            try
            {
                _dbContext.ShowTimePrices.Add(price);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"AddPrice error: {ex.Message}");
                throw new Exception("An error occurred while adding slot price.");
            }
        }

        public async Task UpdatePrice(int type_id, int slot_id, ShowTimePriceUpdateRequest request)
        {
            var price = await _dbContext.ShowTimePrices.FirstOrDefaultAsync(p => p.type_id == type_id && p.slot_id == slot_id);
            if (price == null) throw new Exception("Slot Price not found");

            try
            {
                if (request.base_price.HasValue) price.base_price = request.base_price.Value;
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"UpdatePrice error: {ex.Message}");
                throw new Exception("An error occurred while updating slot price.");
            }
        }

        public async Task DeletePrice(int type_id, int slot_id)
        {
            var price = await _dbContext.ShowTimePrices.FirstOrDefaultAsync(p => p.type_id == type_id && p.slot_id == slot_id);
            if (price == null) throw new Exception("Slot Price not found");
            _dbContext.ShowTimePrices.Remove(price);
            await _dbContext.SaveChangesAsync();
        }
    }
}
