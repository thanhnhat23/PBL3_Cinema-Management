using System.ComponentModel.DataAnnotations;

namespace CinemaAPI.Models
{
    public enum RoleType
    {
        Admin = 0,
        Staff = 1,
        Customer = 2,
        
    }

    public class  Role
    {
        [Key]
        public int role_id { get; set; }

        public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
        
        public RoleType type { get; set; }
    }
}