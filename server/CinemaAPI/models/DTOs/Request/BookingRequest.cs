using CinemaAPI.Models;
using System.ComponentModel.DataAnnotations;

namespace CinemaAPI.Models.DTOs
{
    public class BookingCreateRequest
    {
        [Required]
        public string user_id { get; set; } = string.Empty;
        public int showtime_id { get; set; }
        public int? coupon_id { get; set; }
        public decimal totalAmount { get; set; }
        public decimal? discountAmount { get; set; }
        public decimal finalAmount { get; set; }
        public BookingStatus status { get; set; }
         public DateTime? createAt { get; set; } = DateTime.Now;
    }
    public class BookingUpdateRequest
    {
        public Guid? user_id { get; set; }
        public int? showtime_id { get; set; }
        public int? coupon_id { get; set; }
        public decimal? totalAmount { get; set; }
        public decimal? discountAmount { get; set; }
        public decimal? finalAmount { get; set; }
        public BookingStatus? status { get; set; }
       
    }
}
