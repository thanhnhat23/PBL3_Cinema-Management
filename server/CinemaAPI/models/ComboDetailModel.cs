using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Models
{
    [PrimaryKey(nameof(combo_id), nameof(snack_id))]
    public class ComboDetail
    {
        public int combo_id { get; set; }

        [ForeignKey("combo_id")]
        public virtual Snack ComboSnack { get; set; } = null!;

        public int snack_id { get; set; }

        [ForeignKey("snack_id")]
        public virtual Snack Snack { get; set; } = null!;

        public int quantity { get; set; }
        public DateTime? deleted_at { get; set; }
        public Guid? deleted_by { get; set; }
    }
}