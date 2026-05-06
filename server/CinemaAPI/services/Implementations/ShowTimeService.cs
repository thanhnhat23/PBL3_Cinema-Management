using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Abstract;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Services.Implementations
{
    public class ShowTimeService : BaseService<ShowTime>, IShowTimeService
    {
        private readonly AppDbContext _dbContext;

        public ShowTimeService(AppDbContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<ShowTime>> GetAllShowTimes() =>
            await _dbContext.ShowTimes
                .AsNoTracking()
                .Include(st => st.Movie)
                .Include(st => st.Room)
                    .ThenInclude(r => r.Cinema)
                        .ThenInclude(c => c.Location)
                .Include(st => st.Slot)
                .Include(st => st.ShowTimePrices)
                .Include(st => st.ShowTimeSeats)
                .AsSplitQuery()
                .ToListAsync();

        public async Task<ShowTime?> GetShowTimeById(int showtime_id)
        {
            var showTime = await _dbContext.ShowTimes
                .AsNoTracking()
                .Include(st => st.Movie)
                .Include(st => st.Room)
                    .ThenInclude(r => r.Cinema)
                        .ThenInclude(c => c.Location)
                .Include(st => st.Slot)
                .Include(st => st.ShowTimePrices)
                .Include(st => st.ShowTimeSeats)
                    .ThenInclude(sts => sts.Seat)
                        .ThenInclude(seat => seat.SeatType)
                .AsSplitQuery()
                .FirstOrDefaultAsync(st => st.showtime_id == showtime_id);

            if (showTime != null && (showTime.ShowTimeSeats == null || !showTime.ShowTimeSeats.Any()))
            {
                // Self-healing: if seats are missing, populate them now
                var seatsInRoom = await _dbContext.Seats
                    .Where(s => s.room_id == showTime.room_id)
                    .ToListAsync();

                if (seatsInRoom.Any())
                {
                    var showTimeSeats = seatsInRoom.Select(s => new ShowTimeSeat
                    {
                        showtime_id = showTime.showtime_id,
                        seat_id = s.seat_id,
                        status = ShowTimeSeatStatus.Available
                    }).ToList();

                    await _dbContext.ShowTimeSeats.AddRangeAsync(showTimeSeats);
                    await _dbContext.SaveChangesAsync();
                    
                    // Reload to get the full objects with included Seats
                    showTime = await _dbContext.ShowTimes
                        .AsNoTracking()
                        .Include(st => st.Movie)
                        .Include(st => st.Room)
                            .ThenInclude(r => r.Cinema)
                                .ThenInclude(c => c.Location)
                        .Include(st => st.Slot)
                        .Include(st => st.ShowTimePrices)
                        .Include(st => st.ShowTimeSeats)
                            .ThenInclude(sts => sts.Seat)
                                .ThenInclude(seat => seat.SeatType)
                        .AsSplitQuery()
                        .FirstOrDefaultAsync(st => st.showtime_id == showtime_id);
                }
            }

            return showTime;
        }

        public async Task<decimal?> GetEffectiveSeatPrice(int showtime_id, int seat_id)
        {
            var st = await _dbContext.ShowTimes
                .AsNoTracking()
                .Include(s => s.ShowTimePrices)
                .Include(s => s.ShowTimeSeats)
                    .ThenInclude(ss => ss.Seat)
                        .ThenInclude(seat => seat.SeatType)
                .AsSplitQuery()
                .FirstOrDefaultAsync(s => s.showtime_id == showtime_id);

            if (st == null) return null;

            var sts = st.ShowTimeSeats.FirstOrDefault(x => x.seat_id == seat_id);
            if (sts != null)
            {
                if (st.pricing_model == PricingModel.SeatBased || st.pricing_model == PricingModel.Mixed)
                {
                    if (sts.price_override.HasValue) return sts.price_override.Value;
                }

                // fallback to seat type price
                var seatTypeId = sts.Seat?.type_id;
                if (seatTypeId.HasValue)
                {
                    var stPrice = st.ShowTimePrices.FirstOrDefault(p => p.type_id == seatTypeId.Value);
                    if (stPrice != null) return stPrice.base_price;
                }
            }
            else
            {
                var seat = await _dbContext.Seats.Include(s => s.SeatType).FirstOrDefaultAsync(s => s.seat_id == seat_id);
                if (seat != null)
                {
                    var stPrice = st.ShowTimePrices.FirstOrDefault(p => p.type_id == seat.type_id);
                    if (stPrice != null) return stPrice.base_price;
                }
            }

            return null;
        }

        public async Task AddShowTime(ShowTime showTime)
        {
            using var tx = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                _dbContext.ShowTimes.Add(showTime);
                await _dbContext.SaveChangesAsync();

                // Automatically populate ShowTimeSeats from Room's Seats
                var seatsInRoom = await _dbContext.Seats
                    .Where(s => s.room_id == showTime.room_id)
                    .ToListAsync();

                if (seatsInRoom.Any())
                {
                    var showTimeSeats = seatsInRoom.Select(s => new ShowTimeSeat
                    {
                        showtime_id = showTime.showtime_id,
                        seat_id = s.seat_id,
                        status = ShowTimeSeatStatus.Available
                    }).ToList();

                    await _dbContext.ShowTimeSeats.AddRangeAsync(showTimeSeats);
                    await _dbContext.SaveChangesAsync();
                }

                await tx.CommitAsync();
            }
            catch (Exception ex)
            {
                await tx.RollbackAsync();
                var innerMessage = ex.InnerException?.Message ?? ex.Message;
                Console.WriteLine($"AddShowTime error: {innerMessage}");
                throw new Exception($"An error occurred while creating showtime: {innerMessage}");
            }
        }

        public async Task<ShowTime> CreateShowTimeFromSlotAsync(ShowTimeFromSlotRequest request)
        {
            var slot = await _dbContext.ShowTimeSlots
                .FirstOrDefaultAsync(s => s.slot_id == request.slot_id && s.deleted_at == null);
            if (slot == null)
                throw new Exception("Slot not found or is deleted");

            if (slot.status == ShowTimeSlotStatus.Cancelled || slot.status == ShowTimeSlotStatus.Draft)
                throw new Exception("Slot is not in Scheduled or Published state");

            // Validate date matches slot's dayOfWeek
            var dateDayOfWeek = (int)request.date.DayOfWeek;  // 0=Sun, 1=Mon, ..., 6=Sat
            if (dateDayOfWeek != slot.dayOfWeek)
                throw new Exception($"Date {request.date:yyyy-MM-dd} is {(DayOfWeek)dateDayOfWeek}, but slot requires {(DayOfWeek)slot.dayOfWeek}");

            // Get movie runtime
            var movie = await _dbContext.Movies.FirstOrDefaultAsync(m => m.movie_id == request.movie_id);
            if (movie == null)
                throw new Exception("Movie not found");

            // Compute startTime from date + slot startTime
            var startTime = request.date.Date + slot.startTime;
            
            // Compute endTime = startTime + movie runtime (in minutes)
            var endTime = startTime.AddMinutes(movie.runtime);

            // Validate that endTime <= slot.endTime (movie fits in slot)
            var slotEndTime = request.date.Date + slot.endTime;
            if (endTime > slotEndTime)
                throw new Exception($"Movie runtime ({movie.runtime}m) exceeds slot duration. Movie ends at {endTime:HH:mm} but slot ends at {slotEndTime:HH:mm}");

            var showTime = new ShowTime
            {
                room_id = request.room_id,
                movie_id = request.movie_id,
                slot_id = request.slot_id,
                startTime = startTime,
                endTime = endTime,
                pricing_model = request.pricing_model.HasValue ? (PricingModel)request.pricing_model.Value : PricingModel.PriceBased,
            };

            await AddShowTime(showTime);
            return showTime;
        }

        public async Task UpdateShowTime(int showtime_id, ShowTimeUpdateRequest request)
        {
            var st = await _dbContext.ShowTimes.FirstOrDefaultAsync(s => s.showtime_id == showtime_id);
            if (st == null) throw new Exception("Showtime not found");

            try
            {
                if (request.room_id.HasValue) st.room_id = request.room_id.Value;
                if (request.movie_id.HasValue) st.movie_id = request.movie_id.Value;
                if (request.startTime.HasValue) st.startTime = request.startTime.Value;
                if (request.endTime.HasValue) st.endTime = request.endTime.Value;
                if (request.slot_id.HasValue) st.slot_id = request.slot_id;
                if (request.pricing_model.HasValue) st.pricing_model = (PricingModel)request.pricing_model.Value;

                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"UpdateShowTime error: {ex.Message}");
                throw new Exception("An error occurred while updating showtime.");
            }
        }

        public async Task SoftDeleteShowTime(int showtime_id)
        {
            try
            {
                var st = await _dbContext.ShowTimes.FirstOrDefaultAsync(s => s.showtime_id == showtime_id);
                if (st == null) throw new Exception("Showtime not found");
                await SoftDeleteAsync(st);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"SoftDeleteShowTime error: {ex.Message}");
                throw new Exception("An error occurred while deleting showtime.");
            }
        }

        public async Task HardDeleteShowTime(int showtime_id)
        {
            using var tx = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                var st = await _dbContext.ShowTimes
                    .Include(s => s.ShowTimeSeats)
                    .Include(s => s.ShowTimePrices)
                    .Include(s => s.Bookings)
                    .AsSplitQuery()
                    .FirstOrDefaultAsync(s => s.showtime_id == showtime_id);

                if (st == null) throw new Exception("Showtime not found");

                // Check for existing bookings
                if (st.Bookings.Any())
                {
                    throw new Exception("Cannot hard delete showtime with existing bookings. Please delete related bookings first.");
                }

                // Delete related showtime seats first
                if (st.ShowTimeSeats.Any())
                {
                    _dbContext.ShowTimeSeats.RemoveRange(st.ShowTimeSeats);
                }

                // Delete related showtime prices
                if (st.ShowTimePrices.Any())
                {
                    _dbContext.ShowTimePrices.RemoveRange(st.ShowTimePrices);
                }

                await _dbContext.SaveChangesAsync();

                // Delete the showtime itself
                _dbContext.ShowTimes.Remove(st);
                await _dbContext.SaveChangesAsync();

                await tx.CommitAsync();
            }
            catch (Exception ex)
            {
                await tx.RollbackAsync();
                Console.WriteLine($"HardDeleteShowTime error: {ex.Message}");
                throw new Exception("An error occurred while hard deleting showtime.");
            }
        }
    }
}
