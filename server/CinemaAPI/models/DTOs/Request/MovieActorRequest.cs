namespace CinemaAPI.Models.DTOs 
{
    
    public class MovieActorRequest
    {
        public int movie_id { get; set; }
        public int actor_id { get; set; }
        public string role { get; set; } = null!;
        public string character_name { get; set; } = null!;
    }

    public class MovieActorUpdateRequest
    {
        public string? role { get; set; }
        public string? character_name { get; set; }
    }
}
