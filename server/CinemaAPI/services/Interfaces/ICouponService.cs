using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;

namespace CinemaAPI.Services.Interfaces
{
    public interface ICouponService
    {
        Task<List<Coupon>> GetAllCoupons();
        Task<Coupon?> GetCouponById(int coupon_id);
        // Task<Coupon?> GetCouponByCode(string code);
        Task AddCoupon(Coupon coupon);
        Task UpdateCoupon(int coupon_id, CouponUpdateRequest request);
        Task DeleteCoupon(int coupon_id);
    }
}