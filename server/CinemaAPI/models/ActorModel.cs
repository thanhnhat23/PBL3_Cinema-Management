using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CinemaAPI.Models
{
    public enum ActorGender
    {
        Other = 0,
        Female = 1,
        Male = 2,
    }

    public class Actor
    {
        [Key]
        public int actor_id { get; set; }

        [JsonIgnore]
        public virtual ICollection<MovieActor> MovieActors { get; set; } = new List<MovieActor>();

        [Required, MaxLength(100)]
        public string name { get; set; } = null!;

        [MaxLength(2000)]
        public string? biography { get; set; }

        [MaxLength(200)]
        public string? place_of_birth { get; set; }

        [MaxLength(200)]
        public string? profile_path { get; set; }

        public ActorGender gender { get; set; }

        public DateOnly? birthday { get; set; }
    }
}