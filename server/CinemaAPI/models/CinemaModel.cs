using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using MongoDB.Driver;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Models
{
    [Index(nameof(name))]
    public class Cinema
    {
        [Key]
        public int cinema_id { get; set; }

        [JsonIgnore]
        public virtual ICollection<Room> Rooms { get; set; } = new List<Room>();
        [JsonIgnore]
        public virtual ICollection<Inventory> Inventories { get; set; } = new List<Inventory>();

        public int location_id { get; set; }
        [ForeignKey("location_id")]
        public virtual Location Location { get; set; } = null!;

        [Required, MaxLength(100)]
        public string name { get; set; } = null!;

        [Required, MaxLength(200)]
        public string address { get; set; } = null!;

        [Required]
        public decimal latitude { get; set; }

        [Required]
        public decimal longitude { get; set; }

        [Phone, MaxLength(15)]
        public string phone_number { get; set; } = null!;

        [MaxLength(5000)]
        public string? description { get; set; } = null;

        [MaxLength(100)]
        public string image_overview { get; set; } = null!;
    }
}