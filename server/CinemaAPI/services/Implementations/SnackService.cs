using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Abstract;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Services.Implementations
{
    public class SnackService : BaseService<Snack>, ISnackService
    {
        private new readonly AppDbContext _dbContext;

        public SnackService(AppDbContext dbContext)
            : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Snack>> GetAllSnacks() =>
            await _dbContext.Snacks
                .AsNoTracking()
                .Include(s => s.BookingSnacks)
                .Include(s => s.ComboDetails)
                .Include(s => s.Inventory)
                .ToListAsync();

        public async Task<Snack?> GetSnackById(int snack_id) =>
            await _dbContext.Snacks
                .AsNoTracking()
                .Include(s => s.BookingSnacks)
                .Include(s => s.ComboDetails)
                .Include(s => s.Inventory)
                .FirstOrDefaultAsync(s => s.snack_id == snack_id);


        public async Task AddSnack(Snack snack)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                _dbContext.Snacks.Add(snack);
                await _dbContext.SaveChangesAsync();
                RagCacheKeys.Invalidate("snacks");
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"AddRoom Error: {ex.Message}");
                throw new Exception($"An error occurred while adding the room: {ex.Message}");
            }
        }

        public async Task UpdateSnack(int snack_id, SnackUpdateRequest request)
        {
            var snack = await _dbContext.Snacks.FindAsync(snack_id);
            if (snack == null)
                throw new Exception("Snack not found");
            try
            {
                if (request.name != null)
                    snack.name = request.name;
                if (request.price.HasValue)
                    snack.price = request.price.Value;
                if (request.type.HasValue)
                    snack.type = request.type.Value;
                if (request.imageUrl != null)
                    snack.imageUrl = request.imageUrl;
                await _dbContext.SaveChangesAsync();
                RagCacheKeys.Invalidate("snacks");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"UpdateSnack Error: {ex.Message}");
                throw new Exception($"An error occurred while updating the snack: {ex.Message}");
            }
        }

        public async Task SoftDeleteSnackById(int snack_id)
        {
            try
            {
                var snackToDelete = await _dbContext.Snacks
                    .Include(s => s.BookingSnacks)
                    .Include(s => s.ComboDetails)
                    .Include(s => s.Inventory)
                    .FirstOrDefaultAsync(s => s.snack_id == snack_id);
                if (snackToDelete == null) throw new Exception("Snack not found");
                if (snackToDelete.BookingSnacks.Any() || snackToDelete.ComboDetails.Any() || snackToDelete.Inventory.Any())
                    throw new Exception("Cannot delete snack that is associated with bookings, combo details, or inventory records.");

                await SoftDeleteAsync(snackToDelete);
                RagCacheKeys.Invalidate("snacks");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"SoftDeleteSnack Error: {ex.Message}");
                throw new Exception($"An error occurred while deleting the snack: {ex.Message}");
            }
        }

        public async Task HardDeleteSnackById(int snack_id)
        {
            try
            {
                var snackToDelete = await _dbContext.Snacks
                    .Include(s => s.BookingSnacks)
                    .Include(s => s.ComboDetails)
                    .Include(s => s.Inventory)
                    .FirstOrDefaultAsync(s => s.snack_id == snack_id);

                if (snackToDelete == null) throw new Exception("Snack not found");
                if (snackToDelete.BookingSnacks.Any() || snackToDelete.ComboDetails.Any() || snackToDelete.Inventory.Any())
                    throw new Exception("Cannot hard delete snack that is associated with bookings, combo details, or inventory records.");

                await HardDeleteAsync(snackToDelete);
                RagCacheKeys.Invalidate("snacks");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"HardDeleteSnack Error: {ex.Message}");
                throw new Exception($"An error occurred while hard deleting the snack: {ex.Message}");
            }
        }
    }
}
