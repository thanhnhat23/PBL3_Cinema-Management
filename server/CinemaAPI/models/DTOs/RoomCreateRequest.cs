namespace CinemaAPI.Models.DTOs
{
    public class RoomCreateRequest
    {
        public int cinema_id { get; set; }
        public string nameRoom { get; set; } = null!;
        public RoomLayoutType roomLayoutType{ get; set; } = RoomLayoutType.Standard;
        public decimal price { get; set; }
        public int rows { get; set; }
        public int cols { get; set; }
    }
}