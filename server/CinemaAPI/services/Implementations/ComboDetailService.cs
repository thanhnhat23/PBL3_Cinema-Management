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
                .Include(cd => cd.Snack)
                .ToListAsync();
        public async Task<ComboDetail?> GetComboDetailById(int combo_detail_id) =>
            await _dbContext.ComboDetails
                .Include(cd => cd.Snack)
                .FirstOrDefaultAsync(cd => cd.combo_id == combo_detail_id);
        public async Task AddComboDetail(ComboDetail comboDetail)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
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
        public async Task UpdateComboDetail(int combo_detail_id, ComboDetailUpdateRequest request)
        {
            var comboDetail = await _dbContext.ComboDetails.FindAsync(combo_detail_id);
            if (comboDetail == null)
                throw new Exception("Combo detail not found");
            try
            {
                if (request.combo_id.HasValue)
                    comboDetail.combo_id = request.combo_id.Value;

                if (request.snack_id.HasValue)
                    comboDetail.snack_id = request.snack_id.Value;

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
        public async Task SoftDeleteComboDetail(int combo_detail_id)
        {
            using var transaction = await _dbContext.Database.BeginTransactionAsync();
            try
            {
                var comboDetail = await _dbContext.ComboDetails.FindAsync(combo_detail_id);
                if (comboDetail == null)
                    throw new Exception("Combo detail not found");

                await SoftDeleteAsync(comboDetail);
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                Console.WriteLine($"Error soft deleting combo detail: {ex.Message}");
                throw new Exception("An error occurred while deleting the combo detail. Please try again.");
            }
        }

        public async Task HardDeleteComboDetail(int combo_detail_id)
        {
            try
            {
                var comboDetail = await _dbContext.ComboDetails.FindAsync(combo_detail_id);
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
