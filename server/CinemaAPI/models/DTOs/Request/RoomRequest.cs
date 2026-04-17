namespace CinemaAPI.Models.DTOs
{
    public class RoomCreateRequest
    {
        public int cinema_id { get; set; }
        public string nameRoom { get; set; } = null!;
        public RoomLayoutType roomLayoutType{ get; set; } = RoomLayoutType.Standard;
        public decimal price { get; set; }
        public int row { get; set; }
        public int column { get; set; }
    }

    public class RoomUpdateRequest
    {
        public string? nameRoom { get; set; }
        public RoomLayoutType? roomLayoutType { get; set; }
        public decimal? price { get; set; }
    }

    public class RoomDeleteRequest
    {
        public DateTime deleted_at { get; set; } = DateTime.UtcNow;
    }
}