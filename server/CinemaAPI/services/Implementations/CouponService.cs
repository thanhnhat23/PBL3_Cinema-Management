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

        public async Task<List<Coupon>> GetAllCoupons() =>//LAMBDA FUNCTION(thay cho return)
            await _dbContext.Coupons.ToListAsync();

        public async Task<Coupon?> GetCouponById(int coupon_id) =>
            await _dbContext.Coupons.FirstOrDefaultAsync(c => c.coupon_id == coupon_id);

        public async Task AddCoupon(Coupon coupon)
        {
            
        }

        public async Task UpdateCoupon(int coupon_id, CouponUpdateRequest request) {}


        public async Task DeleteCoupon(int coupon_id) {}
    }
}