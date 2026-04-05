using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Models
{
    public enum UserType
    {
        Admin,
        Staff,
        User
    }

    [Index(nameof(verificationToken))]
    [Index(nameof(passwordResetToken))]
    [Index(nameof(role))]
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

        [JsonConverter(typeof(TmdbService.DateTimeConverter))]
        public DateTime birthDate { get; set; }

        public string? avatar_path { get; set; }

        [NotMapped]
        public int age => DateTime.Now.Year - birthDate.Year;

        public bool isBanned { get; set; } = false;

        public UserType role { get; set; } = UserType.User;

        [JsonConverter(typeof(TmdbService.DateTimeConverter))]
        public DateTime createAt { get; set; } = DateTime.UtcNow;

        public string? passwordResetToken { get; set; }
        public DateTime? resetTokenExpires { get; set; }

        public bool isEmailVerified { get; set; } = false;
        public string? verificationToken { get; set; }
        public DateTime? verificationTokenExpires { get; set; }
    }
}