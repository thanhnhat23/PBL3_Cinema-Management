using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Services.Implementations
{
    public class ShowTimeSeatService : IShowTimeSeatService
    {
        private readonly AppDbContext _dbContext;

        public ShowTimeSeatService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<ShowTimeSeat>> GetAllShowTimeSeats() =>
            await _dbContext.ShowTimeSeats
                .AsNoTracking()
                .Include(s => s.Seat)
                .Include(s => s.ShowTime)
                .ToListAsync();

        public async Task<ShowTimeSeat?> GetShowTimeSeatById(int id) =>
            await _dbContext.ShowTimeSeats
                .AsNoTracking()
                .Include(s => s.Seat)
                .Include(s => s.ShowTime)
                .FirstOrDefaultAsync(s => s.stseat_id == id);

        public async Task AddShowTimeSeat(ShowTimeSeat seat)
        {
            try
            {
                _dbContext.ShowTimeSeats.Add(seat);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"AddShowTimeSeat error: {ex.Message}");
                throw new Exception("An error occurred while adding showtime seat.");
            }
        }

        public async Task UpdateShowTimeSeat(int id, ShowTimeSeatUpdateRequest request)
        {
            var seat = await _dbContext.ShowTimeSeats.FirstOrDefaultAsync(s => s.stseat_id == id);
            if (seat == null) throw new Exception("ShowTimeSeat not found");

            try
            {
                if (request.booking_id.HasValue) seat.booking_id = request.booking_id.Value;
                if (request.status.HasValue) seat.status = (ShowTimeSeatStatus)request.status.Value;

                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"UpdateShowTimeSeat error: {ex.Message}");
                throw new Exception("An error occurred while updating showtime seat.");
            }
        }

        public async Task DeleteShowTimeSeat(int id)
        {
            var seat = await _dbContext.ShowTimeSeats.FindAsync(id);
            if (seat == null) throw new Exception("ShowTimeSeat not found");
            _dbContext.ShowTimeSeats.Remove(seat);
            await _dbContext.SaveChangesAsync();
        }
    }
}
