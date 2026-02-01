using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaAPI.Models
{
    public enum PointType
    {
        Earned,
        Redeemed,
        Expired
    }

    public class PointTransaction
    {
        [Key]
        public Guid transaction_id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid user_id { get; set; }
        [ForeignKey("user_id")]
        public virtual User User { get; set; } = null!;

        public int booking_id { get; set; }
        [ForeignKey("booking_id")]
        public virtual Booking? Booking { get; set; }

        public int amount { get; set; }
        public PointType type { get; set; }
        public DateTime occurredAt { get; set; } = DateTime.UtcNow;
    }
}