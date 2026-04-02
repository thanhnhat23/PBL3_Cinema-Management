namespace CinemaAPI.Models.DTOs
{
    public class PaymentCreateRequest
    { 
        public int booking_id { get; set; }
        public decimal amount { get; set; }
        public PaymentType method { get; set; }
        public PaymentStatus status { get; set; } = PaymentStatus.Pending;
        public string? provider { get; set; }
        public string? transaction_code { get; set; }
        public DateTime paidAt { get; set; } = DateTime.Now;
        public string ? refund_code { get; set; }
        public DateTime? refundAt { get; set; }
    }
    public class PaymentUpdateRequest
    {
        public int? booking_id { get; set; }
        public decimal? amount { get; set; }
        public PaymentType? method { get; set; }
        public PaymentStatus? status { get; set; }
        public string? provider { get; set; }
        public string? transaction_code { get; set; }
        public DateTime? paidAt { get; set; }
        public string ? refund_code { get; set; }
        public DateTime? refundAt { get; set; }
    }
}