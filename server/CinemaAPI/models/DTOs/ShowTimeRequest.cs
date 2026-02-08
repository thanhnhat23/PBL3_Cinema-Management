namespace CinemaAPI.Models.DTOs
{
    
    public class ShowTimeCreateRequest
    {
        public int movie_id { get; set; }
        public int room_id { get; set; }
        public DateTime start_time { get; set; }
        public DateTime end_time { get; set; }
    }
    public class ShowTimeUpdateRequest
    {
        public DateTime? start_time { get; set; }
        public DateTime? end_time { get; set; }
    }
}
