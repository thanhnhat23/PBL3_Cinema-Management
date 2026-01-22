using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MongoDB.Driver;

namespace CinemaAPI.Models
{
    public class Cinema
    {
        [Key]
        public int cinema_id { get; set; }

        public virtual ICollection<Room> Rooms { get; set; } = new List<Room>();

        public int location_id { get; set; }
        [ForeignKey("location_id")]
        public virtual Location Location { get; set; } = null!;

        [Required, MaxLength(100)]
        public string name { get; set; } = null!;

        [Required, MaxLength(200)]
        public string address { get; set; } = null!;

        [Phone, MaxLength(15)]
        public string phone_number { get; set; } = null!;

        [MaxLength(5000)]
        public string? description { get; set; } = null;

        [MaxLength(100)]
        public string image_overview { get; set; } = null!;
    }
}