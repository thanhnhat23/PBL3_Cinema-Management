using System.Text.Json.Serialization;

namespace CinemaAPI.Models.DTOs
{
    public class ShowTimeCreateRequest
    {
        public int room_id { get; set; }
        public int movie_id { get; set; }
        [JsonPropertyName("startTime")]
        public DateTime startTime { get; set; }
        [JsonPropertyName("endTime")]
        public DateTime endTime { get; set; }
        public int? slot_id { get; set; }

        public int? pricing_model { get; set; }
        public int? status { get; set; }
    }

    public class ShowTimeUpdateRequest
    {
        public int? room_id { get; set; }
        public int? movie_id { get; set; }
        [JsonPropertyName("startTime")]
        public DateTime? startTime { get; set; }
        [JsonPropertyName("endTime")]
        public DateTime? endTime { get; set; }
        public int? slot_id { get; set; }
        public int? pricing_model { get; set; }
        public int? status { get; set; }
    }

    // Create ShowTime from Slot: automatically compute startTime/endTime based on slot dayOfWeek and provided date
    public class ShowTimeFromSlotRequest
    {
        public int room_id { get; set; }
        public int movie_id { get; set; }
        public int slot_id { get; set; }
        
        // Date to create showtime for (e.g., "2026-05-15")
        [JsonPropertyName("date")]
        public DateTime date { get; set; }

        public int? pricing_model { get; set; }
        public int? status { get; set; }
    }
}
