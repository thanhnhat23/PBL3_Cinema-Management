using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Services.Implementations
{
    public class SeatService : ISeatService
    {
        private readonly AppDbContext _dbContext;

        public SeatService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Get all seats
        public async Task<List<Seat>> GetAllSeats() =>
            await _dbContext.Seats
                .Include(s => s.Room)
                .Include(s => s.SeatType)
                .ToListAsync();

        // Get seat by ID
        public async Task<Seat?> GetSeatById(int seat_id) =>
            await _dbContext.Seats
                .Include(s => s.Room)
                .Include(s => s.SeatType)
                .FirstOrDefaultAsync(s => s.seat_id == seat_id);

        // Get all seats in a room
        public async Task<List<Seat>> GetSeatOnRoom(int room_id) =>
            await _dbContext.Seats
                .Include(s => s.Room)
                .Include(s => s.SeatType)
                .Where(s => s.room_id == room_id && s.deleted_at == null)
                .OrderBy(s => s.row_index)
                .ThenBy(s => s.column_index)
                .ToListAsync();

        // Add new seat
        public async Task AddSeat(Seat seat)
        {
            try
            {
                _dbContext.Seats.Add(seat);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {   
                Console.WriteLine($"Error in SeatService.AddSeat: {ex.Message}");
                throw new Exception($"An error occurred while adding the seat.");
            }
        }

        public async Task UpdateSeat(int seat_id, SeatUpdateRequest request)
        {
            var seat = await _dbContext.Seats.FirstOrDefaultAsync(s => s.seat_id == seat_id);
            if (seat == null)
                throw new Exception("Seat not found");

            try
            {
                if (request.row_index.HasValue)
                    seat.row_index = request.row_index.Value;
                if (request.column_index.HasValue)
                    seat.column_index = request.column_index.Value;
                if (request.type_id.HasValue)
                    seat.type_id = request.type_id.Value;

                _dbContext.Seats.Update(seat);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in SeatService.UpdateSeat: {ex.Message}");
                throw new Exception($"An error occurred while updating the seat.");
            }
          
        }

        public async Task DeleteSeat(int seat_id)
        {
            try
            {
                var seat = await _dbContext.Seats.FirstOrDefaultAsync(s => s.seat_id == seat_id);
                if (seat == null)
                    throw new Exception("Seat not found");

                seat.deleted_at = DateOnly.FromDateTime(DateTime.Now);
                _dbContext.Seats.Update(seat);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new Exception($"An error occurred while deleting the seat: {ex.Message}");
            }
        }
    }
}
