using CinemaAPI.data;
using CinemaAPI.Models;
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
        public async Task<List<Room>> GetAllRooms() => await _dbContext.Rooms.ToListAsync();
        // Get room by ID
        public async Task<Room?> GetRoomById(int room_id) => await _dbContext.Rooms.FindAsync(room_id);

        public async Task AddRoom(Room room, int rows, int cols)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                _dbContext.Rooms.Add(room);
                await _dbContext.SaveChangesAsync();

                var seats = new List<Seat>();
                for (int row = 1; row <= rows; row++)
                {
                    char rowLabel = (char)('A' + row - 1);
                    for (int col = 1; col <= cols; col++)
                    {
                        bool isCoupleSeat = (col <= 2);

                        seats.Add(new Seat
                        {
                           room_id = room.room_id,
                           rowNumber = row,
                           columnNumber = col,
                           seatCode = $"{rowLabel}{col}",
                           type = isCoupleSeat ? SeatType.Couple : SeatType.Single
                        });
                    }
                }

                _dbContext.Seats.AddRange(seats);
                await _dbContext.SaveChangesAsync();
                await transaction.CommitAsync();

            } catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public async Task UpdateRoom(int room_id, Room updatedRoom)
        {
            var room = await _dbContext.Rooms.FindAsync(room_id);
            try
            {
                if (room != null)
                {
                    room.nameRoom = updatedRoom.nameRoom;
                    room.roomLayoutType = updatedRoom.roomLayoutType;
                    room.price = updatedRoom.price;
                    await _dbContext.SaveChangesAsync();
                }
            } catch (Exception)
            {
                throw;
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

                        if (room == null) throw new Exception("Phòng không tồn tại.");

                        // Check if the room has any showtimes to avoid losing booking data
                        if (room.Showtimes.Any()) 
                            throw new Exception("Cannot delete a room that has showtimes. Please delete the showtimes first.");

                        // Delete associated seats first
                        _dbContext.Seats.RemoveRange(room.Seats);
                        _dbContext.Rooms.Remove(room);

                        await _dbContext.SaveChangesAsync();
                        await transaction.CommitAsync();
            } catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}