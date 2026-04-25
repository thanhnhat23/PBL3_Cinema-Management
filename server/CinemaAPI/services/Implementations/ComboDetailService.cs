using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Abstract;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Services.Implementations
{
    public class ComboDetailService : BaseService<ComboDetail>, IComboDetail
    {
        private new readonly AppDbContext _dbContext;
        public ComboDetailService(AppDbContext dbContext)
            : base(dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<List<ComboDetail>> GetAllComboDetails() =>
            await _dbContext.ComboDetails
                .Include(cd => cd.ComboSnack)
                .Include(cd => cd.Snack)
                .ToListAsync();

        public async Task<List<ComboDetail>> GetComboDetailsByComboId(int combo_id) =>
            await _dbContext.ComboDetails
                .Include(cd => cd.ComboSnack)
                .Include(cd => cd.Snack)
                .Where(cd => cd.combo_id == combo_id)
                .ToListAsync();

        public async Task<ComboDetail?> GetComboDetail(int combo_id, int snack_id) =>
            await _dbContext.ComboDetails
                .Include(cd => cd.ComboSnack)
                .Include(cd => cd.Snack)
                .FirstOrDefaultAsync(cd => cd.combo_id == combo_id && cd.snack_id == snack_id);

        public async Task AddComboDetail(ComboDetail comboDetail)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                var exists = await _dbContext.ComboDetails.AnyAsync(cd =>
                    cd.combo_id == comboDetail.combo_id && cd.snack_id == comboDetail.snack_id);

                if (exists)
                    throw new Exception("Combo detail already exists");

                _dbContext.ComboDetails.Add(comboDetail);
                await _dbContext.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error adding combo detail: {ex.Message}");
                throw new Exception("An error occurred while adding the combo detail. Please try again.");
            }
        }

        public async Task UpdateComboDetail(int combo_id, int snack_id, ComboDetailUpdateRequest request)
        {
            var comboDetail = await _dbContext.ComboDetails
                .FirstOrDefaultAsync(cd => cd.combo_id == combo_id && cd.snack_id == snack_id);

            if (comboDetail == null)
                throw new Exception("Combo detail not found");

            try
            {
                if (request.quantity.HasValue)
                    comboDetail.quantity = request.quantity.Value;

                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating combo detail: {ex.Message}");
                throw new Exception("An error occurred while updating the combo detail. Please try again.");
            }

        }

        public async Task SoftDeleteComboDetail(int combo_id, int snack_id)
        {
            try
            {
                var comboDetail = await _dbContext.ComboDetails
                    .FirstOrDefaultAsync(cd => cd.combo_id == combo_id && cd.snack_id == snack_id);

                if (comboDetail == null)
                    throw new Exception("Combo detail not found");

<<<<<<< HEAD
                comboDetail.deleted_at = DateOnly.FromDateTime(DateTime.UtcNow);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting combo detail: {ex.Message}");
=======
                await SoftDeleteAsync(comboDetail);
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error soft deleting combo detail: {ex.Message}");
>>>>>>> 64b54274b703aa37d89b1771b91e6500cdf8b73b
                throw new Exception("An error occurred while deleting the combo detail. Please try again.");
            }
        }

        public async Task HardDeleteComboDetail(int combo_id, int snack_id)
        {
            try
            {
                var comboDetail = await _dbContext.ComboDetails
                    .FirstOrDefaultAsync(cd => cd.combo_id == combo_id && cd.snack_id == snack_id);

                if (comboDetail == null)
                    throw new Exception("Combo detail not found");

                await HardDeleteAsync(comboDetail);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error hard deleting combo detail: {ex.Message}");
                throw new Exception("An error occurred while hard deleting the combo detail. Please try again.");
            }
        }
    }
}
