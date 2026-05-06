using System.ComponentModel.DataAnnotations;

namespace CinemaAPI.Models.DTOs
{
    public class ShowTimeSlotCreateRequest
    {
        // Day of week: 0=Sunday, 1=Monday, ..., 6=Saturday
        [Range(0, 6)]
        public int dayOfWeek { get; set; }

        // Time format: "HH:mm" (e.g., "14:00", "16:30")
        public string startTime { get; set; } = string.Empty;
        public string endTime { get; set; } = string.Empty;

        public bool? reusable { get; set; }
        public int? status { get; set; }
    }

    public class ShowTimeSlotUpdateRequest
    {
        public int? dayOfWeek { get; set; }
        public string? startTime { get; set; }
        public string? endTime { get; set; }
        public bool? reusable { get; set; }
        public int? status { get; set; }
    }
}
