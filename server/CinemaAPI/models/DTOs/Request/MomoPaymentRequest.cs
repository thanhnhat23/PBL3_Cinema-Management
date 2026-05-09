namespace CinemaAPI.Models.DTOs
{
    public class MomoPaymentCreateRequest
    {
        public int booking_id { get; set; }
        public string? orderInfo { get; set; }
        public string? requestType { get; set; } // captureMoMoWallet or payWithATM
        public string? returnUrl { get; set; }
    }

    public class CreateMomoPaymentResult
    {
        public int payment_id { get; set; }
        public string orderId { get; set; } = string.Empty;
        public string payUrl { get; set; } = string.Empty;
        public MomoPaymentStatus status { get; set; }
    }

    public class MomoPaymentCallbackResult
    {
        public bool isValidSignature { get; set; }
        public bool isSuccess { get; set; }
        public string orderId { get; set; } = string.Empty;
        public string? message { get; set; }
        public int? resultCode { get; set; }
        public MomoPaymentStatus status { get; set; }
    }
}
