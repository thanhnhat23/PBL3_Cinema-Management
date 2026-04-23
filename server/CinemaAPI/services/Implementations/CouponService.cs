using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Services.Implementations
{
    public class CouponService : ICouponService
    {
        private readonly AppDbContext _dbContext;
        public CouponService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Coupon>> GetAllCoupons() => //LAMBDA FUNCTION(thay cho return)
            await _dbContext.Coupons.ToListAsync();

        public async Task<Coupon?> GetCouponById(int coupon_id) =>
            await _dbContext.Coupons.FirstOrDefaultAsync(c => c.coupon_id == coupon_id);

        public async Task<string> GenerateUniqueCouponCodeAsync()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var random = new Random();
            string code;
            int attempts = 0;
            const int maxAttempts = 10;

            do
            {
                code = new string(Enumerable.Range(0, 8).Select(_ => chars[random.Next(chars.Length)]).ToArray());
                var exists = await _dbContext.Coupons.AnyAsync(c => c.code == code);
                if (!exists)
                    return code;

                attempts++;
            } while (attempts < maxAttempts);

            throw new InvalidOperationException("Failed to generate unique coupon code after multiple attempts.");
        }

        public async Task AddCoupon(Coupon coupon)
        {
            _dbContext.Coupons.Add(coupon);
            await _dbContext.SaveChangesAsync();
        }

        public async Task UpdateCoupon(int coupon_id, CouponUpdateRequest request)
        {
            var coupon = await _dbContext.Coupons.FirstOrDefaultAsync(c => c.coupon_id == coupon_id);

            if (coupon != null)
            {
                if (request.type.HasValue)
                    coupon.type = request.type.Value;
                    
                if (request.description != null)
                    coupon.description = request.description;

                if (request.discountValue.HasValue)
                    coupon.discountValue = request.discountValue.Value;

                if (request.maxDiscountAmount.HasValue)
                    coupon.maxDiscountAmount = request.maxDiscountAmount.Value;

                if (request.minOrderValue.HasValue)
                    coupon.minOrderValue = request.minOrderValue.Value;

                if (request.startDate.HasValue)
                    coupon.startDate = request.startDate.Value;

                if (request.endDate.HasValue)
                    coupon.endDate = request.endDate.Value;

                if (request.isHoliday.HasValue)
                    coupon.isHoliday = request.isHoliday.Value;

                _dbContext.Coupons.Update(coupon);
                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task DeleteCoupon(int coupon_id)
        {
           try
            {
                var coupon = await _dbContext.Coupons.FirstOrDefaultAsync(c => c.coupon_id == coupon_id);

                if (coupon == null)
                    throw new Exception("Coupon not found");

               coupon.deleted_at = DateOnly.FromDateTime(DateTime.UtcNow);
                await _dbContext.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error deleting coupon: {ex.Message}");
                throw new Exception($"An error occurred while deleting the coupon: {ex.Message}");
            }
        }
    }
}