using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Abstract;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Services.Implementations
{
    public class BookingService : BaseService<Booking>, IBookingService
    {
        private new readonly AppDbContext _dbContext;

        public BookingService(AppDbContext dbContext)
            : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Booking>> GetAllBookings() =>
            await _dbContext.Bookings
                .AsNoTracking()
                .Include(b => b.User)
                .Include(b => b.ShowTime)
                    .ThenInclude(st => st.Room)
                        .ThenInclude(r => r.Cinema)
                .OrderByDescending(b => b.createAt)
                .ToListAsync();

        public async Task<Booking?> GetBookingById(int booking_id) =>
            await _dbContext.Bookings
                .AsNoTracking()
                .Include(b => b.User)
                .Include(b => b.ShowTime)
                    .ThenInclude(st => st.Room)
                        .ThenInclude(r => r.Cinema)
                .FirstOrDefaultAsync(b => b.booking_id == booking_id);

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

        public async Task<Booking> CreateBookingWithSnacksAsync(BookingCreateRequest request)
        {
            if (!Guid.TryParse(request.user_id, out var userId))
                throw new Exception("Invalid user_id format");

            var showTime = await _dbContext.ShowTimes
                .Include(st => st.Room)
                .FirstOrDefaultAsync(st => st.showtime_id == request.showtime_id);

            if (showTime == null)
                throw new Exception("Showtime not found");

            var snackRequests = (request.snacks ?? new List<BookingSnackRequest>())
                .Where(item => item.quantity > 0)
                .GroupBy(item => item.snack_id)
                .Select(group => new BookingSnackRequest
                {
                    snack_id = group.Key,
                    quantity = group.Sum(item => item.quantity),
                })
                .ToList();

            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                var snackIds = snackRequests.Select(item => item.snack_id).ToHashSet();
                var snacks = snackIds.Count == 0
                    ? new Dictionary<int, Snack>()
                    : await _dbContext.Snacks
                        .Where(snack => snackIds.Contains(snack.snack_id))
                        .ToDictionaryAsync(snack => snack.snack_id);

                if (snackIds.Count != snacks.Count)
                    throw new Exception("One or more snacks do not exist");

                var comboSnackIds = snacks.Values
                    .Where(snack => snack.type == SnackType.Combo)
                    .Select(snack => snack.snack_id)
                    .ToHashSet();

                var comboDetails = comboSnackIds.Count == 0
                    ? new List<ComboDetail>()
                    : await _dbContext.ComboDetails
                        .Where(detail => comboSnackIds.Contains(detail.combo_id))
                        .Include(detail => detail.Snack)
                        .ToListAsync();

                var inventoryDeduction = new Dictionary<int, int>();
                var bookingSnackRows = new List<BookingSnacks>();

                decimal totalAmount = 0;
                decimal discountAmount = 0;

                foreach (var snackRequest in snackRequests)
                {
                    var snack = snacks[snackRequest.snack_id];

                    if (snack.type == SnackType.Combo)
                    {
                        var detailRows = comboDetails
                            .Where(detail => detail.combo_id == snack.snack_id)
                            .ToList();

                        if (detailRows.Count == 0)
                            throw new Exception($"Combo snack {snack.snack_id} has no combo details");

                        decimal comboBaseUnitPrice = 0;

                        foreach (var detailRow in detailRows)
                        {
                            var requiredQuantity = detailRow.quantity * snackRequest.quantity;

                            if (inventoryDeduction.ContainsKey(detailRow.snack_id))
                                inventoryDeduction[detailRow.snack_id] += requiredQuantity;
                            else
                                inventoryDeduction[detailRow.snack_id] = requiredQuantity;

                            comboBaseUnitPrice += detailRow.Snack.price * detailRow.quantity;
                        }

                        var comboDiscountedUnitPrice = Math.Round(comboBaseUnitPrice * 0.9m, 2);
                        var comboLineBaseTotal = comboBaseUnitPrice * snackRequest.quantity;
                        var comboLineDiscountedTotal = comboDiscountedUnitPrice * snackRequest.quantity;

                        totalAmount += comboLineBaseTotal;
                        discountAmount += comboLineBaseTotal - comboLineDiscountedTotal;

                        bookingSnackRows.Add(new BookingSnacks
                        {
                            snack_id = snack.snack_id,
                            quantity = snackRequest.quantity,
                            price = comboDiscountedUnitPrice,
                        });

                        continue;
                    }

                    if (inventoryDeduction.ContainsKey(snack.snack_id))
                        inventoryDeduction[snack.snack_id] += snackRequest.quantity;
                    else
                        inventoryDeduction[snack.snack_id] = snackRequest.quantity;

                    totalAmount += snack.price * snackRequest.quantity;

                    bookingSnackRows.Add(new BookingSnacks
                    {
                        snack_id = snack.snack_id,
                        quantity = snackRequest.quantity,
                        price = snack.price,
                    });
                }

                var inventorySnackIds = inventoryDeduction.Keys.ToList();
                var inventories = inventorySnackIds.Count == 0
                    ? new List<Inventory>()
                    : await _dbContext.Inventories
                        .Where(inventory => inventory.cinema_id == showTime.Room.cinema_id
                                            && inventorySnackIds.Contains(inventory.snack_id))
                        .ToListAsync();

                foreach (var snackId in inventorySnackIds)
                {
                    var inventory = inventories.FirstOrDefault(item => item.snack_id == snackId);
                    if (inventory == null)
                        throw new Exception($"Inventory not found for snack {snackId} in cinema {showTime.Room.cinema_id}");

                    var required = inventoryDeduction[snackId];
                    if (inventory.quantity < required)
                        throw new Exception($"Insufficient inventory for snack {snackId} in cinema {showTime.Room.cinema_id}");

                    inventory.quantity -= required;
                }

                var finalAmount = totalAmount - discountAmount;

                var booking = new Booking
                {
                    user_id = userId,
                    showtime_id = request.showtime_id,
                    coupon_id = request.coupon_id,
                    totalAmount = totalAmount,
                    discountAmount = discountAmount,
                    finalAmount = finalAmount,
                    createAt = request.createAt ?? DateTime.UtcNow,
                    status = BookingStatus.Pending,
                };

                _dbContext.Bookings.Add(booking);
                await _dbContext.SaveChangesAsync();

                foreach (var bookingSnack in bookingSnackRows)
                {
                    bookingSnack.booking_id = booking.booking_id;
                }

                if (bookingSnackRows.Count > 0)
                {
                    _dbContext.BookingSnacks.AddRange(bookingSnackRows);
                    await _dbContext.SaveChangesAsync();
                }

                await transaction.CommitAsync();
                return booking;
            }
            catch (Exception e)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error in BookingService.CreateBookingWithSnacksAsync: {e.Message}");
                throw;
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
<<<<<<< HEAD
                public async Task DeleteBooking(int booking_id)
                {
                    try
                    {
                    var booking = await _dbContext.Bookings.FindAsync(booking_id);   
                    if (booking == null)
                        throw new Exception("Booking not found");
                    booking.deleted_at = DateOnly.FromDateTime(DateTime.UtcNow);
                    await _dbContext.SaveChangesAsync();
                    }
                    catch (Exception e)
                    {
                        Console.WriteLine($"Error in BookingService.DeleteBooking: {e.Message}");
                        throw new Exception("An error occurred while deleting the booking.");
                    }
                }
=======
            catch (Exception e)
            {
                Console.WriteLine($"Error in BookingService.UpdateBooking: {e.Message}");
                throw new Exception("An error occurred while updating the booking.");
            }
        }
>>>>>>> 64b54274b703aa37d89b1771b91e6500cdf8b73b
    }
}