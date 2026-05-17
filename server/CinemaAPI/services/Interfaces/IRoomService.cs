using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;

namespace CinemaAPI.Services.Interfaces
{
    public interface IRoomService
    {
        Task<List<Room>> GetAllRooms();
        Task<Room?> GetRoomById(int room_id);
        Task AddRoom(Room room);
        Task UpdateRoom(int room_id, RoomUpdateRequest request);
        Task SoftDeleteRoom(int room_id, Guid? deletedBy);
        Task HardDeleteRoom(int room_id);
    }
}