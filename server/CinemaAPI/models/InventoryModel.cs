using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaAPI.Models
{
    public class Inventory
    {
        public int snack_id { get; set; }
        [ForeignKey("snack_id")]
        public virtual Snack Snack { get; set; } = null!;

        public int cinema_id { get; set; }
        [ForeignKey("cinema_id")]
        public virtual Cinema Cinema { get; set; } = null!;

        public int quantity { get; set; }
    }
}