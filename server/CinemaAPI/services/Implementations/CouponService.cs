using CinemaAPI.data;
using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Abstract;
using CinemaAPI.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Services.Implementations
{
    public class CouponService : BaseService<Coupon>, ICouponService
    {
        private new readonly AppDbContext _dbContext;
        public CouponService(AppDbContext dbContext)
            : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Coupon>> GetAllCoupons()
        {
            await MaintainCouponsAsync();
            return await _dbContext.Coupons.ToListAsync();
        }

        public async Task<Coupon?> GetCouponById(int coupon_id)
        {
            await MaintainCouponsAsync();
            return await _dbContext.Coupons.FirstOrDefaultAsync(c => c.coupon_id == coupon_id);
        }

        private async Task MaintainCouponsAsync()
        {
            var now = DateTime.UtcNow;
            var coupons = await _dbContext.Coupons.Where(c => c.deleted_at == null).ToListAsync();
            bool changed = false;

            foreach (var coupon in coupons)
            {
                // 1. Never coupons are always active unless disabled
                if (coupon.coupon_type == CouponType.Never)
                {
                    if (coupon.status == CouponStatus.Expired)
                    {
                        coupon.status = CouponStatus.Active;
                        changed = true;
                    }
                    continue;
                }

                // 2. Check for expiration of Limited coupons
                if (coupon.coupon_type == CouponType.Limited && coupon.status == CouponStatus.Active && now > coupon.endDate)
                {
                    coupon.status = CouponStatus.Expired;
                    changed = true;
                }

                // 3. Holiday Reset Logic
                if (coupon.coupon_type == CouponType.Holiday)
                {
                    // Valid for 3 days starting from startDate
                    var holidayEnd = coupon.startDate.AddDays(2);
                    
                    if (now >= coupon.startDate && now <= holidayEnd)
                    {
                        // Reset usage if this is a new holiday period
                        if (coupon.last_reset_at == null || coupon.last_reset_at < coupon.startDate)
                        {
                            coupon.current_usage = 0;
                            coupon.last_reset_at = now;
                            coupon.status = CouponStatus.Active;
                            changed = true;
                        }
                    }
                    else if (now > holidayEnd && coupon.status == CouponStatus.Active)
                    {
                        coupon.status = CouponStatus.Expired;
                        changed = true;
                    }
                }
            }

            if (changed)
            {
                await _dbContext.SaveChangesAsync();
            }
        }

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
                if (request.code != null)
                    coupon.code = request.code;

                if (request.type.HasValue)
                    coupon.type = request.type.Value;

                if (request.coupon_type.HasValue)
                    coupon.coupon_type = request.coupon_type.Value;

                if (request.status.HasValue)
                    coupon.status = request.status.Value;

                if (request.description != null)
                    coupon.description = request.description;

                if (request.discountValue.HasValue)
                    coupon.discountValue = request.discountValue.Value;

                if (request.maxDiscountAmount.HasValue)
                    coupon.maxDiscountAmount = request.maxDiscountAmount.Value;

                if (request.minOrderValue.HasValue)
                    coupon.minOrderValue = request.minOrderValue.Value;

                if (request.max_usage.HasValue)
                    coupon.max_usage = request.max_usage.Value;

                if (request.startDate.HasValue)
                    coupon.startDate = request.startDate.Value;

                if (request.endDate.HasValue)
                    coupon.endDate = request.endDate.Value;

                if (request.isHoliday.HasValue)
                    coupon.isHoliday = request.isHoliday.Value;

                if (request.applies_to != null)
                    coupon.applies_to = request.applies_to;

                _dbContext.Coupons.Update(coupon);
                await _dbContext.SaveChangesAsync();
            }
        }

        public async Task SoftDeleteCoupon(int coupon_id)
        {
            try {
                var coupon = await _dbContext.Coupons.FirstOrDefaultAsync(c => c.coupon_id == coupon_id);
                if (coupon != null)
                {
                    await SoftDeleteAsync(coupon);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error soft deleting coupon: {ex.Message}");
                throw new Exception("An error occurred while deleting the coupon. Please try again.");
            }

        }

        public async Task HardDeleteCoupon(int coupon_id)
        {
            try {
                var coupon = await _dbContext.Coupons
                    .Include(c => c.Bookings)
                    .Include(c => c.UserVouchers)
                    .FirstOrDefaultAsync(c => c.coupon_id == coupon_id);

                if (coupon == null)
                    throw new Exception("Coupon not found");

                if (coupon.Bookings.Any() || coupon.UserVouchers.Any())
                    throw new Exception("Cannot hard delete coupon that is already linked to bookings or user vouchers.");

                await HardDeleteAsync(coupon);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error hard deleting coupon: {ex.Message}");
                throw new Exception("An error occurred while hard deleting the coupon. Please try again.");
            }
        }
    }
}