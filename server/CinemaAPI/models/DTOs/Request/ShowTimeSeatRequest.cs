namespace CinemaAPI.Models.DTOs
{
    public class ShowTimeSeatCreateRequest
    {
        public int seat_id { get; set; }
        public int showtime_id { get; set; }
        public int? booking_id { get; set; }
        public int status { get; set; }
    }

    public class ShowTimeSeatUpdateRequest
    {
        public int? booking_id { get; set; }
        public int? status { get; set; }
    }
}
