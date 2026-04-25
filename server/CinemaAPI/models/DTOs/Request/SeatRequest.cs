namespace CinemaAPI.Models.DTOs
{
    public class SeatCreateRequest
    {
        public int room_id { get; set; }
        public int type_id { get; set; }
        public int row_index { get; set; }
        public int column_index { get; set; }
        public string seat_code { get; set; } = null!;
    }

    public class SeatUpdateRequest
    {
        public int? type_id { get; set; }
        public string? seat_code { get; set; }
        public int? row_index { get; set; }
        public int? column_index { get; set; }
    }
}
