using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace CinemaAPI.Models
{
    public enum UserType
    {
        Admin,
        Staff,
        User
    }

    public class User
    {
        [Key]
        public Guid user_id { get; set; } = Guid.NewGuid();

        [JsonIgnore]
        public virtual ICollection<UserVoucher> UserVouchers { get; set; } = new List<UserVoucher>();
        [JsonIgnore]
        public virtual ICollection<PointTransaction> PointTransactions { get; set; } = new List<PointTransaction>();
        // public virtual ICollection<UserRole> UserRoles { get; set;} = new List<UserRole>();

        [Required, MaxLength(50)]
        public string userName { get; set; } = null!;

        [Required, MaxLength(150), EmailAddress]
        public string email { get; set; } = null!;

        [Required, MaxLength(255)]
        public string passwordHash { get; set; } = null!;

        public DateTime birthDate { get; set; }

        [NotMapped]
        public int age => DateTime.Now.Year - birthDate.Year;
        public UserType role { get; set; } = UserType.User;
        public DateTime createAt { get; set; } = DateTime.UtcNow;
        public string? passwordResetToken { get; set; }
        public DateTime? resetTokenExpires { get; set; }

        public bool isEmailVerified { get; set; } = false;
        public string? verificationToken { get; set; }
        public DateTime? verificationTokenExpires { get; set; }
    }
}