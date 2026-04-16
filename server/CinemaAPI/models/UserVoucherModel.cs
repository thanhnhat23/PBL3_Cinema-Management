using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaAPI.Models
{
    public class UserVoucher
    {
        public Guid user_id { get; set; }
        [ForeignKey("user_id")]
        public virtual User User { get; set; } = null!;

        public int coupon_id { get; set; }
        [ForeignKey("coupon_id")]
        public virtual Coupon Coupons { get; set; } = null!;

        public bool isUsed { get; set; } = false;
        public DateTime? usedAt { get; set; } = null;
        public DateTime assignedAt { get; set; } = DateTime.UtcNow;
        public DateOnly? deleted_at { get; set; }
    }
}