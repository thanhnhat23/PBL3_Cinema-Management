using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

    public class Room
    {
        [Key]
        public int room_id { get; set; }

        public virtual ICollection<Seat> Seats { get; set; } = new List<Seat>();
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
    }
}