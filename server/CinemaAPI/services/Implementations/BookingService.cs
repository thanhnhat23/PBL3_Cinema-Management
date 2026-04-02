using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Services.Implementations
{
    public class BookingService : IBookingService
    {
        private readonly AppDbContext _dbContext;

        public BookingService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Booking>> GetAllBookings() =>
            await _dbContext.Bookings.ToListAsync();

        public async Task<Booking?> GetBookingById(int booking_id) =>
            await _dbContext.Bookings.FirstOrDefaultAsync(b => b.booking_id == booking_id);

        public async Task AddBooking(Booking booking)
        {
            try
            {
                _dbContext.Bookings.Add(booking);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error in BookingService.AddBooking: {e.Message}");
                throw new Exception("An error occurred while adding the booking.");
            }
        }
            public async Task UpdateBooking(int booking_id, BookingUpdateRequest request)
            {
                var booking = await _dbContext.Bookings.FindAsync(booking_id);
                if (booking == null)
                    throw new Exception("Booking not found");
                try 
                {
                    if (request.user_id.HasValue)
                        booking.user_id = request.user_id.Value;
                    if (request.showtime_id.HasValue)
                        booking.showtime_id = request.showtime_id.Value;
                    if (request.coupon_id.HasValue)
                        booking.coupon_id = request.coupon_id.Value;
                    if (request.totalAmount.HasValue)
                        booking.totalAmount = request.totalAmount.Value;
                    if (request.discountAmount.HasValue)
                        booking.discountAmount = request.discountAmount.Value;
                    if (request.finalAmount.HasValue)
                        booking.finalAmount = request.finalAmount.Value;
                    if (request.status.HasValue)
                        booking.status = request.status.Value;                     
                    _dbContext.Bookings.Update(booking);
                    await _dbContext.SaveChangesAsync();
                }
                catch (Exception e)
                {
                    Console.WriteLine($"Error in BookingService.UpdateBooking: {e.Message}");
                    throw new Exception("An error occurred while updating the booking.");
                }
            }
                public async Task DeleteBooking(int booking_id)
                {
                    using var transaction = await _dbContext.Database.BeginTransactionAsync();
                    try
                    {
                        var booking = await _dbContext.Bookings.FirstOrDefaultAsync(b => b.booking_id == booking_id);

                        if (booking == null)
                            throw new Exception("Booking not found"); 

                        _dbContext.Bookings.Remove(booking);
                        await _dbContext.SaveChangesAsync();
                        await transaction.CommitAsync();
                    }
                    catch (Exception e)
                    {
                        await transaction.RollbackAsync();
                        Console.WriteLine($"Error in BookingService.DeleteBooking: {e.Message}");
                        throw new Exception("An error occurred while deleting the booking.");
                    }
                }
    }
}