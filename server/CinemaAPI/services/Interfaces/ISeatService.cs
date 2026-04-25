using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;

namespace CinemaAPI.Services.Interfaces
{
    public interface ISeatService
    {
        Task<List<Seat>> GetAllSeats();
        Task<Seat?> GetSeatById(int seat_id);
        Task<List<Seat>> GetSeatOnRoom(int room_id);
        Task AddSeat(Seat seat);
        Task UpdateSeat(int seat_id, SeatUpdateRequest request);
        Task DeleteSeat(int seat_id);
    }
}
