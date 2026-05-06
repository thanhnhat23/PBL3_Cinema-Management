using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Models
{
    public enum ShowTimeSlotStatus
    {
        Draft = 0,
        Scheduled = 1,
        Published = 2,
        Cancelled = 3
    }

    [Index(nameof(dayOfWeek))]
    public class ShowTimeSlot
    {
        [Key]
        public int slot_id { get; set; }

        // Day of week: 0=Sunday, 1=Monday, ..., 6=Saturday
        [Range(0, 6)]
        public int dayOfWeek { get; set; }

        // Time of day (e.g., 14:00, 16:30) as TimeSpan
        public TimeSpan startTime { get; set; }
        public TimeSpan endTime { get; set; }

        // Reusable: if true, this slot can be used as template for recurring showtimes
        public bool reusable { get; set; } = true;

        public ShowTimeSlotStatus status { get; set; } = ShowTimeSlotStatus.Scheduled;

        public DateTime? deleted_at { get; set; }
        public Guid? deleted_by { get; set; }
        public virtual ICollection<ShowTime>? ShowTimes { get; set; }
    }
}
