using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Abstract;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Services.Implementations
{
    public class InventoryService : BaseService<Inventory>, IInventoryService
    {
        private new readonly AppDbContext _dbContext;

        public InventoryService(AppDbContext dbContext)
            : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Inventory>> GetAllInventories() =>
            await _dbContext.Inventories
                .Include(i => i.Snack)
                .Include(i => i.Cinema)
                .ToListAsync();

        public async Task<Inventory?> GetInventoryById(int cinema_id, int snack_id) =>
            await _dbContext.Inventories
                .Include(i => i.Snack)
                .Include(i => i.Cinema)
                .FirstOrDefaultAsync(i => i.cinema_id == cinema_id && i.snack_id == snack_id);

        public async Task AddInventory(Inventory inventory)
        {
            if (inventory.quantity < 0)
                throw new Exception("Inventory quantity cannot be negative");

            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                _dbContext.Inventories.Add(inventory);
                await _dbContext.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error adding inventory: {ex.Message}");
                throw new Exception("An error occurred while adding the inventory. Please try again.");
            }
        }

        public async Task UpdateInventory(int cinema_id, int snack_id, InventoryUpdateRequest request)
        {
            var inventory = await _dbContext.Inventories
                .FirstOrDefaultAsync(i => i.cinema_id == cinema_id && i.snack_id == snack_id);
            if (inventory == null)
                throw new Exception("Inventory not found");
            try
            {
                if (request.cinema_id.HasValue)
                    inventory.cinema_id = request.cinema_id.Value;

                if (request.snack_id.HasValue)
                    inventory.snack_id = request.snack_id.Value;

                if (request.quantity.HasValue)
                {
                    if (request.quantity.Value < 0)
                        throw new Exception("Inventory quantity cannot be negative");

                    inventory.quantity = request.quantity.Value;
                }

                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating inventory: {ex.Message}");
                throw new Exception("An error occurred while updating the inventory. Please try again.");
            }
        }
<<<<<<< HEAD

        public async Task DeleteInventory(int cinema_id, int snack_id)
        {
            try
            {
                var inventory = await _dbContext.Inventories
                    .FirstOrDefaultAsync(i => i.cinema_id == cinema_id && i.snack_id == snack_id);
                if (inventory == null)
                    throw new Exception("Inventory not found");

                inventory.deleted_at = DateOnly.FromDateTime(DateTime.UtcNow);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting inventory: {ex.Message}");
                throw new Exception("An error occurred while deleting the inventory. Please try again.");
            }
        }   
=======
>>>>>>> 64b54274b703aa37d89b1771b91e6500cdf8b73b
    }
}