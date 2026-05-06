using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Services.Implementations
{
    public class ShowTimeSlotService : IShowTimeSlotService
    {
        private readonly AppDbContext _dbContext;

        public ShowTimeSlotService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<ShowTimeSlot>> GetAllSlots() =>
            await _dbContext.Set<ShowTimeSlot>()
                .AsNoTracking()
                .ToListAsync();

        public async Task<ShowTimeSlot?> GetSlotById(int slot_id) =>
            await _dbContext.Set<ShowTimeSlot>()
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.slot_id == slot_id);

        public async Task AddSlot(ShowTimeSlot slot)
        {
            try
            {
                if (slot.dayOfWeek < 0 || slot.dayOfWeek > 6)
                    throw new Exception("dayOfWeek must be 0-6 (0=Sunday, 6=Saturday)");
                if (slot.endTime <= slot.startTime)
                    throw new Exception("endTime must be after startTime");

                _dbContext.Set<ShowTimeSlot>().Add(slot);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"AddSlot error: {ex.Message}");
                throw new Exception("An error occurred while creating the slot.");
            }
        }

        public async Task UpdateSlot(int slot_id, CinemaAPI.Models.DTOs.ShowTimeSlotUpdateRequest request)
        {
            var slot = await _dbContext.Set<ShowTimeSlot>().FirstOrDefaultAsync(s => s.slot_id == slot_id);
            if (slot == null) throw new Exception("ShowTimeSlot not found");

            try
            {
                if (request.dayOfWeek.HasValue)
                {
                    if (request.dayOfWeek.Value < 0 || request.dayOfWeek.Value > 6)
                        throw new Exception("dayOfWeek must be 0-6");
                    slot.dayOfWeek = request.dayOfWeek.Value;
                }

                if (!string.IsNullOrEmpty(request.startTime))
                {
                    if (TimeSpan.TryParse(request.startTime, out var startTs))
                        slot.startTime = startTs;
                    else
                        throw new Exception($"Invalid startTime format: {request.startTime}. Use HH:mm");
                }

                if (!string.IsNullOrEmpty(request.endTime))
                {
                    if (TimeSpan.TryParse(request.endTime, out var endTs))
                        slot.endTime = endTs;
                    else
                        throw new Exception($"Invalid endTime format: {request.endTime}. Use HH:mm");
                }

                if (slot.endTime <= slot.startTime)
                    throw new Exception("endTime must be after startTime");

                if (request.reusable.HasValue) slot.reusable = request.reusable.Value;
                if (request.status.HasValue) slot.status = (ShowTimeSlotStatus)request.status.Value;

                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"UpdateSlot error: {ex.Message}");
                throw new Exception("An error occurred while updating the slot.");
            }
        }

        public async Task SoftDeleteSlot(int slot_id)
        {
            var slot = await _dbContext.Set<ShowTimeSlot>().FirstOrDefaultAsync(s => s.slot_id == slot_id);
            if (slot == null) throw new Exception("ShowTimeSlot not found");

            await SoftDeleteAsync(slot);
        }

        public async Task HardDeleteSlot(int slot_id)
        {
            var slot = await _dbContext.Set<ShowTimeSlot>().Include(s => s.ShowTimes).FirstOrDefaultAsync(s => s.slot_id == slot_id);
            if (slot == null) throw new Exception("ShowTimeSlot not found");
            if (slot.ShowTimes != null && slot.ShowTimes.Any()) throw new Exception("Cannot hard delete slot with associated showtimes.");

            _dbContext.Set<ShowTimeSlot>().Remove(slot);
            await _dbContext.SaveChangesAsync();
        }

        // reuse BaseService SoftDelete implementation pattern
        private async Task SoftDeleteAsync(ShowTimeSlot entity)
        {
            var deletedAtProp = typeof(ShowTimeSlot).GetProperty("deleted_at");
            if (deletedAtProp != null && deletedAtProp.CanWrite) deletedAtProp.SetValue(entity, DateTime.UtcNow);
            await _dbContext.SaveChangesAsync();
        }
    }
}
