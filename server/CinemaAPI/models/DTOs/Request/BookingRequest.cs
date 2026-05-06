using CinemaAPI.Models;
using System.ComponentModel.DataAnnotations;

namespace CinemaAPI.Models.DTOs
{
    public class BookingSnackRequest
    {
        [Required]
        public int snack_id { get; set; }

        [Range(1, int.MaxValue)]
        public int quantity { get; set; }
    }

    public class BookingCreateRequest
    {
        [Required]
        public string user_id { get; set; } = string.Empty;

        [Required]
        public int showtime_id { get; set; }

        public int? coupon_id { get; set; }

        // Server will recalculate totals based on snacks, seats, and combo rules.
        public decimal totalAmount { get; set; }
        public decimal? discountAmount { get; set; }
        public decimal finalAmount { get; set; }

        public BookingStatus status { get; set; }
        public DateTime? createAt { get; set; } = DateTime.Now;

        public List<BookingSnackRequest> snacks { get; set; } = new();

        // Optional: list of seat IDs to be booked with this booking
        public List<int>? seat_ids { get; set; }
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
