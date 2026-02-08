using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Models
{
    public enum PaymentType 
    {
        CreditCard = 0,
        PayPal = 1,
        BankTransfer = 2
    }
    
    public enum PaymentStatus 
    {
        Success = 0,
        Pending = 1,
        Failed = 2
    }

    [Index(nameof(status))]
    [Index(nameof(transaction_code), IsUnique = true)]
    [Index(nameof(paidAt))]
    [Index(nameof(status), nameof(paidAt))]
    public class Payment
    {
        [Key]
        public int payment_id { get; set; }

        public int booking_id { get; set; }
        [ForeignKey("booking_id")]
        public virtual Booking Booking { get; set; } = null!;

        public decimal amount { get; set; }
        public PaymentType method { get; set; } = PaymentType.CreditCard;
        public PaymentStatus status { get; set; } = PaymentStatus.Pending;

        [MaxLength(100)]
        public string? provider { get; set; }

        [MaxLength(200)]
        public string? transaction_code { get; set; }

        public DateTime paidAt { get; set; }

        [MaxLength(200)]
        public string? refund_code { get; set; }

        public DateTime refundAt { get; set; }
    }
}