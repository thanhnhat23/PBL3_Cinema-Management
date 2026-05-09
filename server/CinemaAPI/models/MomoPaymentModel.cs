using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Models
{
    public enum MomoPaymentStatus
    {
        Pending = 0,
        Success = 1,
        Failed = 2,
        Refunded = 3
    }

    [Index(nameof(status))]
    [Index(nameof(orderId), IsUnique = true)]
    [Index(nameof(requestId), IsUnique = true)]
    [Index(nameof(transId), IsUnique = true)]
    public class MomoPayment
    {
        [Key]
        public int payment_id { get; set; }

        public int booking_id { get; set; }
        [ForeignKey("booking_id")]
        [System.Text.Json.Serialization.JsonIgnore]
        public virtual Booking Booking { get; set; } = null!;

        [Column(TypeName = "decimal(18,2)")]
        public decimal amount { get; set; }

        public string requestType { get; set; } = null!; // captureMoMoWallet or payWithATM
        public MomoPaymentStatus status { get; set; } = MomoPaymentStatus.Pending;

        [MaxLength(100)]
        public string orderId { get; set; } = null!;

        [MaxLength(100)]
        public string requestId { get; set; } = null!;

        [MaxLength(100)]
        public string? transId { get; set; }

        [MaxLength(255)]
        public string? orderInfo { get; set; }

        public int? resultCode { get; set; }

        [MaxLength(2000)]
        public string? message { get; set; }

        [MaxLength(500)]
        public string? signature { get; set; }

        [Required]
        public DateTime createdAt { get; set; } = DateTime.UtcNow;

        public DateTime? paidAt { get; set; }
    }
}
