using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Models
{
    public enum RoomLayoutType
    {
        Standard = 0,

        IMAX = 1,

        [Display(Name = "4DX")]
        FourDX = 2,

        [Display(Name = "3D")]
        ThreeD = 3
    }

    [Index(nameof(roomLayoutType))]
    public class Room
    {
        [Key]
        public int room_id { get; set; }

        [JsonIgnore]
        public virtual ICollection<Seat> Seats { get; set; } = new List<Seat>();
        [JsonIgnore]
        public virtual ICollection<ShowTime> Showtimes { get; set; } = new List<ShowTime>();

        public int cinema_id { get; set; }
        [ForeignKey("cinema_id")]
        public virtual Cinema Cinema { get; set; } = null!;

        [Required]
        public string nameRoom { get; set; } = null!;

        [Required, MaxLength(10)]
        public RoomLayoutType roomLayoutType { get; set; } = RoomLayoutType.Standard;

        [Required]
        public decimal price { get; set; }

        public int row { get; set; }
        public int column { get; set; }
        public DateTime? deleted_at { get; set; }
        public Guid? deleted_by { get; set; }
    }
}