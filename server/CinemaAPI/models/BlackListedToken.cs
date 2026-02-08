using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace CinemaAPI.Models
{
    [Index(nameof(Token), IsUnique = true)]
    [Index(nameof(ExpiryDate))]
    public class BlacklistedToken
    {
        [Key]
        public Guid id { get; set; } = Guid.NewGuid();

        [MaxLength(500)]
        public string Token { get; set; } = null!;

        public DateTime ExpiryDate { get; set; }
    }
}