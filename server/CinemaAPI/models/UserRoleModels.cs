using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaAPI.Models
{
    public class UserRole
    {
        public Guid user_id { get; set; }
        [ForeignKey("user_id")]
        public virtual User User { get; set; } = null!;
        
        public int role_id { get; set; }
        [ForeignKey("role_id")]
        public virtual Role Role { get; set; } = null!;
    }
}