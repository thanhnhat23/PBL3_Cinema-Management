using CinemaAPI.Models;

namespace CinemaAPI.Models.DTOs
{
    public class VnpayPaymentCreateRequest
    {
        public int booking_id { get; set; }
        [System.Text.Json.Serialization.JsonConverter(typeof(System.Text.Json.Serialization.JsonStringEnumConverter))]
        public VnpayPaymentType method { get; set; }
        public decimal? amount { get; set; }
        public string? orderInfo { get; set; }
        public string? returnUrl { get; set; }
    }

    public class CreateVnpayPaymentResult
    {
        public int payment_id { get; set; }
        public string txnRef { get; set; } = string.Empty;
        public string paymentUrl { get; set; } = string.Empty;
        public VnpayPaymentStatus status { get; set; }
        public DateTime expireAt { get; set; }
    }

    public class VnpayPaymentCallbackResult
    {
        public bool isValidSignature { get; set; }
        public bool isSuccess { get; set; }
        public string txnRef { get; set; } = string.Empty;
        public string responseCode { get; set; } = string.Empty;
        public string message { get; set; } = string.Empty;
        public VnpayPaymentStatus? status { get; set; }
    }
}