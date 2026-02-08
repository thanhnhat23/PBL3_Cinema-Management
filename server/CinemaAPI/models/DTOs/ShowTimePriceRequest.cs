namespace CinemaAPI.Models.DTOs
{
    public class ShowTimePriceCreateRequest
    {
        public int showtime_id { get; set; }
        public decimal price { get; set; }
        public string seat_type { get; set; } = null!;
    }

    public class ShowTimePriceUpdateRequest
    {
        public decimal? price { get; set; }
        public string? seat_type { get; set; }
    }
}