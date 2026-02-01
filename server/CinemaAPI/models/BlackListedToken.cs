using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CinemaAPI.Models
{
    public class BlacklistedToken
    {
        [Key]
        public Guid id { get; set; } = Guid.NewGuid();

        [MaxLength(2000)]
        public string Token { get; set; } = null!;

        public DateTime ExpiryDate { get; set; }
    }
}