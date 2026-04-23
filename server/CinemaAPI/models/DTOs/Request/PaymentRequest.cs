namespace CinemaAPI.Models.DTOs
{
    public class PaymentCreateRequest
    {
        public int booking_id { get; set; }
        public PaymentType method { get; set; }
        public decimal? amount { get; set; }
        public string? orderInfo { get; set; }
        public string? returnUrl { get; set; }
    }

    public class CreatePaymentResult
    {
        public int payment_id { get; set; }
        public string txnRef { get; set; } = string.Empty;
        public string paymentUrl { get; set; } = string.Empty;
        public PaymentStatus status { get; set; }
        public DateTime expireAt { get; set; }
    }

    public class PaymentCallbackResult
    {
        public bool isValidSignature { get; set; }
        public bool isSuccess { get; set; }
        public string txnRef { get; set; } = string.Empty;
        public string responseCode { get; set; } = string.Empty;
        public string message { get; set; } = string.Empty;
        public PaymentStatus? status { get; set; }
    }
}