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
                .Where(s => s.room_id == room_id)
                .OrderBy(s => s.row_index)
                .ThenBy(s => s.column_index)
                .ToListAsync();
    }
}
