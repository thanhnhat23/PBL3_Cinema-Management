using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Abstract;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Services.Implementations
{
    public class RoomService : BaseService<Room>, IRoomService
    {
        private readonly AppDbContext _appDbContext;

        public RoomService(AppDbContext dbContext)
            : base(dbContext)
        {
            _appDbContext = dbContext;
        }

        // Get all rooms
        public async Task<List<Room>> GetAllRooms() =>
            await _appDbContext.Rooms
                .AsNoTracking()
                .Include(r => r.Cinema)
                .ThenInclude(c => c.Location)
                .ToListAsync();

        // Get room by ID
        public async Task<Room?> GetRoomById(int room_id) =>
            await _appDbContext.Rooms
                .AsNoTracking()
                .Include(r => r.Cinema)
                .ThenInclude(c => c.Location)
                .FirstOrDefaultAsync(r => r.room_id == room_id);

        public async Task AddRoom(Room room)
        {
            using var transaction = await _appDbContext.Database.BeginTransactionAsync();
            try
            {
                _appDbContext.Rooms.Add(room);
                await _appDbContext.SaveChangesAsync();

                var totalSeats = room.row * room.column;
                var seats = new List<Seat>(totalSeats);
                for (int row = 1; row <= room.row; row++)
                {
                    char rowLabel = (char)('A' + row - 1);
                    for (int col = 1; col <= room.column; col++)
                    {
                        bool isCoupleSeat = (row > room.row - 2);

                        seats.Add(new Seat
                        {
                            room_id = room.room_id,
                            row_index = row,
                            column_index = col,
                            seat_code = $"{rowLabel}{col}",
                            type_id = isCoupleSeat ? (int)SeatEnum.Couple : (int)SeatEnum.Single
                        });
                    }
                }

                var previousAutoDetectChanges = _appDbContext.ChangeTracker.AutoDetectChangesEnabled;
                _appDbContext.ChangeTracker.AutoDetectChangesEnabled = false;
                try
                {
                    await _appDbContext.Seats.AddRangeAsync(seats);
                    await _appDbContext.SaveChangesAsync();
                }
                finally
                {
                    _appDbContext.ChangeTracker.AutoDetectChangesEnabled = previousAutoDetectChanges;
                }

                await transaction.CommitAsync();
                RagCacheKeys.Invalidate("rooms");

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
            var room = await _appDbContext.Rooms
                .Include(r => r.Seats)
                .FirstOrDefaultAsync(r => r.room_id == room_id);

            if (room == null)
                throw new Exception("Room not found");

            using var transaction = await _appDbContext.Database.BeginTransactionAsync();
            try
            {
                if (request.nameRoom != null)
                    room.nameRoom = request.nameRoom;

                if (request.roomLayoutType.HasValue)
                    room.roomLayoutType = request.roomLayoutType.Value;

                if (request.price.HasValue)
                    room.price = request.price.Value;

                int newRow = request.row ?? room.row;
                int newCol = request.column ?? room.column;

                if (newRow != room.row || newCol != room.column)
                {
                    var seatIds = room.Seats.Select(s => s.seat_id).ToList();
                    if (seatIds.Any())
                    {
                        var inUse = await _appDbContext.ShowTimeSeats.AnyAsync(sts => seatIds.Contains(sts.seat_id));
                        if (inUse)
                            throw new Exception("Cannot change room dimensions: some seats in this room are already assigned to showtimes.");

                        _appDbContext.Seats.RemoveRange(room.Seats);
                    }

                    room.row = newRow;
                    room.column = newCol;

                    var newSeats = new List<Seat>();
                    for (int r = 1; r <= newRow; r++)
                    {
                        char rowLabel = (char)('A' + r - 1);
                        for (int c = 1; c <= newCol; c++)
                        {
                            bool isCoupleSeat = (r > newRow - 2);
                            newSeats.Add(new Seat
                            {
                                room_id = room.room_id,
                                row_index = r,
                                column_index = c,
                                seat_code = $"{rowLabel}{c}",
                                type_id = isCoupleSeat ? (int)SeatEnum.Couple : (int)SeatEnum.Single
                            });
                        }
                    }

                    if (newSeats.Any())
                    {
                        await _appDbContext.Seats.AddRangeAsync(newSeats);
                    }
                }

                await _appDbContext.SaveChangesAsync();
                await transaction.CommitAsync();

                RagCacheKeys.Invalidate("rooms");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"UpdateRoom Error: {ex.Message}");
                throw new Exception($"An error occurred while updating the room: {ex.Message}");
            }
        }

        public async Task SoftDeleteRoom(int room_id)
        {
            try
            {
                var room = await _appDbContext.Rooms.FindAsync(room_id);
                if (room == null)
                    throw new Exception("Room not found");

                await SoftDeleteAsync(room);
                RagCacheKeys.Invalidate("rooms");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"SoftDeleteRoom Error: {ex.Message}");
                throw new Exception($"An error occurred while deleting the room: {ex.Message}");
            }
        }

        public async Task HardDeleteRoom(int room_id)
        {
            try
            {
                var room = await _appDbContext.Rooms
                    .Include(r => r.Seats)
                    .Include(r => r.Showtimes)
                    .FirstOrDefaultAsync(r => r.room_id == room_id);

                if (room == null)
                    throw new Exception("Room not found");

                if (room.Showtimes.Any() || room.Seats.Any())
                    throw new Exception("Cannot hard delete room that already has showtimes or seats.");

                await HardDeleteAsync(room);
                RagCacheKeys.Invalidate("rooms");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"HardDeleteRoom Error: {ex.Message}");
                throw new Exception($"An error occurred while hard deleting the room: {ex.Message}");
            }
        }
    }
}