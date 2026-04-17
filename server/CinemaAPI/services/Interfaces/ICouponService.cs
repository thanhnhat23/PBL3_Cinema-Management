using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;

namespace CinemaAPI.Services.Interfaces
{
    public interface ICouponService
    {
        Task<List<Coupon>> GetAllCoupons();
        Task<Coupon?> GetCouponById(int coupon_id);
        Task<string> GenerateUniqueCouponCodeAsync();
        Task AddCoupon(Coupon coupon);
        Task UpdateCoupon(int coupon_id, CouponUpdateRequest request);
    }
}