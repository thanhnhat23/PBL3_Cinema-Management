using CinemaAPI.Models;
using CinemaAPI.Models.DTOs;
using CinemaAPI.Services.Implementations;
using CinemaAPI.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CinemaAPI.Controllers
{
    [ApiController]
    [Route("api/v1/[controller]")]

    public class couponController : ControllerBase
    {
        private readonly ICouponService _couponService;
        private readonly CouponService _couponDeleteService;

        public couponController(ICouponService couponService, CouponService couponDeleteService)
        {
            _couponService = couponService;
            _couponDeleteService = couponDeleteService;
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllCoupons()
        {
            try
            {
                var coupons = await _couponService.GetAllCoupons();
                return Ok(coupons);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in couponController.GetAllCoupons: {ex.Message}");
            }
        }

        [HttpGet("get/{couponId}")]
        public async Task<IActionResult> GetCoupon(int couponId)
        {
            try
            {
                var coupon = await _couponService.GetCouponById(couponId);
                if (coupon == null)
                    return NotFound("Coupon not found");

                return Ok(coupon);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in couponController.GetCoupon: {ex.Message}");
            }
        }

        [HttpGet("active")]
        public async Task<IActionResult> GetActiveCoupons()
        {
            try
            {
                var coupons = await _couponService.GetAllCoupons();
                var activeCoupons = coupons.Where(c => c.deleted_at == null && c.IsActive).ToList();
                return Ok(activeCoupons);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in couponController.GetActiveCoupons: {ex.Message}");
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> AddCoupon([FromBody] CouponCreateRequest request)
        {
            try
            {
                var code = request.code ?? await _couponService.GenerateUniqueCouponCodeAsync();

                var coupon = new Coupon
                {
                    code = code,
                    type = request.type,
                    coupon_type = request.coupon_type,
                    description = request.description ?? "No description",
                    discountValue = request.discountValue,
                    maxDiscountAmount = request.maxDiscountAmount,
                    minOrderValue = request.minOrderValue,
                    max_usage = request.max_usage,
                    startDate = request.startDate,
                    endDate = request.endDate,
                    isHoliday = request.isHoliday,
                    applies_to = request.applies_to
                };

                await _couponService.AddCoupon(coupon);
                return Ok("Coupon created successfully.");
            }
            catch (InvalidOperationException ex)
            {
                return StatusCode(500, $"Failed to generate unique coupon code: {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in couponController.AddCoupon: {ex.Message}");
            }
        }

        [HttpPut("update/{couponId}")]
        public async Task<IActionResult> UpdateCoupon(int couponId, [FromBody] CouponUpdateRequest updateCoupon)
        {
            try
            {
                await _couponService.UpdateCoupon(couponId, updateCoupon);
                return Ok("Coupon updated successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in couponController.UpdateCoupon: {ex.Message}");
            }
        }

        [HttpDelete("delete/{couponId}")]
        public async Task<IActionResult> DeleteCoupon(int couponId)
        {
            try
            {
                await _couponDeleteService.SoftDeleteCoupon(couponId);
                return Ok("Coupon deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in couponController.DeleteCoupon: {ex.Message}");
            }
        }

        [HttpDelete("hard-delete/{couponId}")]
        public async Task<IActionResult> HardDeleteCoupon(int couponId)
        {
            try
            {
                await _couponDeleteService.HardDeleteCoupon(couponId);
                return Ok("Coupon hard deleted successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred in couponController.HardDeleteCoupon: {ex.Message}");
            }
        }
    }
}