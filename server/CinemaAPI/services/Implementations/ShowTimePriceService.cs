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
                .Include(p => p.ShowTime)
                .ToListAsync();

        public async Task<ShowTimePrice?> GetPrice(int type_id, int showtime_id) =>
            await _dbContext.ShowTimePrices
                .AsNoTracking()
                .Include(p => p.SeatType)
                .Include(p => p.ShowTime)
                .FirstOrDefaultAsync(p => p.type_id == type_id && p.showtime_id == showtime_id);

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
                throw new Exception("An error occurred while adding showtime price.");
            }
        }

        public async Task UpdatePrice(int type_id, int showtime_id, ShowTimePriceUpdateRequest request)
        {
            var price = await _dbContext.ShowTimePrices.FirstOrDefaultAsync(p => p.type_id == type_id && p.showtime_id == showtime_id);
            if (price == null) throw new Exception("ShowTimePrice not found");

            try
            {
                if (request.base_price.HasValue) price.base_price = request.base_price.Value;
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"UpdatePrice error: {ex.Message}");
                throw new Exception("An error occurred while updating showtime price.");
            }
        }

        public async Task DeletePrice(int type_id, int showtime_id)
        {
            var price = await _dbContext.ShowTimePrices.FirstOrDefaultAsync(p => p.type_id == type_id && p.showtime_id == showtime_id);
            if (price == null) throw new Exception("ShowTimePrice not found");
            _dbContext.ShowTimePrices.Remove(price);
            await _dbContext.SaveChangesAsync();
        }
    }
}
