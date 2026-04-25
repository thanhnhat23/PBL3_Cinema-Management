using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;

namespace CinemaAPI.Services.Interfaces
{
    public interface IBookingService
    {
        Task<List<Booking>> GetAllBookings();
        Task<Booking?> GetBookingById(int booking_id);
        Task AddBooking(Booking booking);
        Task<Booking> CreateBookingWithSnacksAsync(BookingCreateRequest request);
        Task UpdateBooking(int booking_id, BookingUpdateRequest request);
    }
}
