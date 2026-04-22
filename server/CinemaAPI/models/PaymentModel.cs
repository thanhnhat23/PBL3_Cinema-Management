using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Models
{
    public enum PaymentType 
    {
        VNPAYQR = 0,
        VNBANK = 1,
    }
    
    public enum PaymentStatus 
    {
        Pending = 0,
        Success = 1,
        Failed = 2,
        Refunded = 3
    }

    [Index(nameof(status))]
    [Index(nameof(vnp_TransactionNo), IsUnique = true)] // Ma giao dich tu VNPAY
    [Index(nameof(vnp_TxnRef), IsUnique = true)] // Ma don hang tu VNPAY
    public class Payment
    {
        [Key]
        public int payment_id { get; set; }

        public int booking_id { get; set; }
        [ForeignKey("booking_id")]
        public virtual Booking Booking { get; set; } = null!;

        [Column(TypeName = "decimal(18,2)")]
        public decimal amount { get; set; }

        public PaymentType method { get; set; }
        public PaymentStatus status { get; set; } = PaymentStatus.Pending;

        [MaxLength(50)] // Ma ngan hang tu VNPAY
        public string? vnp_BankCode { get; set; }

        [MaxLength(200)] // Ma giao dich tu VNPAY
        public string? vnp_TransactionNo { get; set; }

        [MaxLength(50)] // Dia chi IP cua khach hang khi thuc hien giao dich
        public string? vnp_IpAddr { get; set; }

        [Required] // Ma don hang tu VNPAY (vnp_TxnRef)
        [MaxLength(100)]
        public string? vnp_TxnRef { get; set; }

        [MaxLength(10)] // Ma phan hoi tu VNPAY
        // 00: Thanh cong
        // 01: Giao dich bi loi, 
        // 02: Giao dich bi huy, 
        // 03: Giao dich cho duyet, 
        public string? vnp_ResponseCode { get; set; }

        [MaxLength(255)] // Mo ta ket qua giao dich tu VNPAY
        public string? vnp_OrderInfo { get; set; }

        [MaxLength(500)] // Chuoi ma hoa du lieu tra ve tu VNPAY, dung de xac thuc tinh toan cua VNPAY
        public string? vnp_SecureHash { get; set; }

        [Required]
        public DateTime vnp_CreateDate { get; set; }

        [Required]
        public DateTime vnp_ExpireDate { get; set; }

        [JsonConverter(typeof(TmdbService.DateTimeConverter))]
        public DateTime? paid_at { get; set; }

        [MaxLength(255)]
        public string? refund_code { get; set; }
        public DateTime? refund_at { get; set; }
    }
}