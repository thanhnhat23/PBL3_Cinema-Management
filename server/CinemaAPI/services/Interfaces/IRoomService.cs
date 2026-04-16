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
        Task DeleteRoom(int room_id, RoomDeleteRequest request);
    }
}