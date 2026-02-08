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

        public async Task<List<ShowTimePrice>> GetAllShowTimePrices() =>
            await _dbContext.ShowTimePrices
                .Include(stp => stp.Showtime)
                .ToListAsync();

        public async Task<ShowTimePrice?> GetShowTimePriceById(int showtime_price_id) =>
            await _dbContext.ShowTimePrices
                .Include(stp => stp.Showtime)
                .FirstOrDefaultAsync(stp => stp.showtime_price_id == showtime_price_id);

        public async Task AddShowTimePrice(ShowTimePrice showTimePrice)
        {
            _dbContext.ShowTimePrices.Add(showTimePrice);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateShowTimePrice(int showtime_price_id, ShowTimePriceRequest request)
        {
            var showTimePrice = await _dbContext.ShowTimePrices.FindAsync(showtime_price_id);

            if (showTimePrice == null)
                throw new Exception("ShowTimePrice not found");

            try
            {
                if (request.showtime_id.HasValue)
                    showTimePrice.showtime_id = request.showtime_id.Value;

                if (request.price.HasValue)
                    showTimePrice.price = request.price.Value;

                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error updating ShowTimePrice: " + ex.Message);
            }
        }

        public async Task DeleteShowTimePrice(int showtime_price_id)
        {
            var showTimePrice = await _dbContext.ShowTimePrices.FindAsync(showtime_price_id);

            if (showTimePrice == null)
                throw new Exception("ShowTimePrice not found");

            _dbContext.ShowTimePrices.Remove(showTimePrice);
            await _dbContext.SaveChangesAsync();
        }
    }
}