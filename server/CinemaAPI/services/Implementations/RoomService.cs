using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Services.Implementations
{
    public class RoomService : IRoomService
    {
        private readonly AppDbContext _dbContext;

        public RoomService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Get all rooms
        public async Task<List<Room>> GetAllRooms() =>
            await _dbContext.Rooms
                .Include(r => r.Cinema)
                .ThenInclude(c => c.Location)
                .ToListAsync();

        // Get room by ID
        public async Task<Room?> GetRoomById(int room_id) =>
            await _dbContext.Rooms
                .Include(r => r.Cinema)
                .ThenInclude(c => c.Location)
                .FirstOrDefaultAsync(r => r.room_id == room_id);

        public async Task AddRoom(Room room)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                _dbContext.Rooms.Add(room);
                await _dbContext.SaveChangesAsync();

                var totalSeats = room.row * room.column;
                var seats = new List<Seat>(totalSeats);
                for (int row = 1; row <= room.row; row++)
                {
                    char rowLabel = (char)('A' + row - 1);
                    for (int col = 1; col <= room.column; col++)
                    {
                        bool isCoupleSeat = (col <= 2);

                        seats.Add(new Seat
                        {
                            room_id = room.room_id,
                            row_index = row,
                            column_index = col,
                            seat_code = $"{rowLabel}{col}",
                            type_id = isCoupleSeat ? (int)SeatEnum.Single : (int)SeatEnum.Couple
                        });
                    }
                }

                var previousAutoDetectChanges = _dbContext.ChangeTracker.AutoDetectChangesEnabled;
                _dbContext.ChangeTracker.AutoDetectChangesEnabled = false;
                try
                {
                    await _dbContext.Seats.AddRangeAsync(seats);
                    await _dbContext.SaveChangesAsync();
                }
                finally
                {
                    _dbContext.ChangeTracker.AutoDetectChangesEnabled = previousAutoDetectChanges;
                }

                await transaction.CommitAsync();

            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"AddRoom Error: {ex.Message}");
                throw new Exception($"An error occurred while adding the room: {ex.Message}");
            }
        }

        public async Task UpdateRoom(int room_id, RoomUpdateRequest request)
        {
            var room = await _dbContext.Rooms.FindAsync(room_id);

            if (room == null)
                throw new Exception("Room not found");

            try
            {
                if (request.nameRoom != null)
                    room.nameRoom = request.nameRoom;

                if (request.roomLayoutType.HasValue)
                    room.roomLayoutType = request.roomLayoutType.Value;

                if (request.price.HasValue)
                    room.price = request.price.Value;

                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"UpdateRoom Error: {ex.Message}");
                throw new Exception($"An error occurred while updating the room: {ex.Message}");
            }
        }

        public async Task DeleteRoom(int room_id)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                var room = await _dbContext.Rooms
                            .Include(r => r.Seats)
                            .Include(r => r.Showtimes)
                            .FirstOrDefaultAsync(r => r.room_id == room_id);

                if (room == null) throw new Exception("Room not found");

                if (room.Showtimes.Any())
                    throw new Exception("Cannot delete a room that has showtimes. Please delete the showtimes first.");

                // Delete associated seats first
                _dbContext.Seats.RemoveRange(room.Seats);
                _dbContext.Rooms.Remove(room);

                await _dbContext.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"DeleteRoom Error: {ex.Message}");
                throw new Exception($"An error occurred while deleting the room: {ex.Message}");
            }
        }
    }
}