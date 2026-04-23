using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Services.Implementations
{
    public class SnackService : ISnackService
    {
        private readonly AppDbContext _dbContext;

        public SnackService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Snack>> GetAllSnacks() =>
            await _dbContext.Snacks
                .Include(s => s.BookingSnacks)
                .Include(s => s.ComboDetails)
                .Include(s => s.Inventory)
                .ToListAsync();

        public async Task<Snack?> GetSnackById(int snack_id) =>
            await _dbContext.Snacks
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
            }catch (Exception ex)
            {
                Console.WriteLine($"UpdateSnack Error: {ex.Message}");
                throw new Exception($"An error occurred while updating the snack: {ex.Message}");
            }
        }

        public async Task DeleteSnackById(int snack_id)
        {
            try
            {
                var snack = await _dbContext.Snacks.FindAsync(snack_id);
                if (snack == null)
                    throw new Exception("Snack not found");
                snack.deleted_at = DateOnly.FromDateTime(DateTime.UtcNow);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting snack: {ex.Message}");
                throw new Exception("An error occurred while deleting the snack. Please try again.", ex);
            }
        }
    }
}
