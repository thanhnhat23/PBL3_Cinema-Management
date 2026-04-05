using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;

namespace CinemaAPI.Services.Interfaces
{
    public interface IBookingService
    {
        Task<List<Booking>> GetAllBookings();
        Task<Booking?> GetBookingById(int booking_id);
        Task AddBooking(Booking booking);
        Task UpdateBooking(int booking_id, BookingUpdateRequest request);
        Task DeleteBooking(int booking_id);
    }
}
