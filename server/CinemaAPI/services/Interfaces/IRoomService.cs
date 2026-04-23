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
<<<<<<< HEAD
        Task DeleteRoom(int room_id);
=======
>>>>>>> 64b54274b703aa37d89b1771b91e6500cdf8b73b
    }
}