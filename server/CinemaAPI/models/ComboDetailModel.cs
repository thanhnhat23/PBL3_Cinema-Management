using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaAPI.Models
{
    public class ComboDetail
    {
        [Key]
        public int combo_id { get; set; }

        public int snack_id { get; set; }
        [ForeignKey("snack_id")]
        public virtual Snack Snack { get; set; } = null!;

        public int quantity { get; set; }
    }
}