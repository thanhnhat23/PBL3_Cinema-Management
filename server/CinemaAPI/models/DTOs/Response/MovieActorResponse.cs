namespace CinemaAPI.Models.DTOs.Response
{
    public class ActorWithMovie
    {
        public Actor Actor { get; set; } = null!;
        public string char_name { get; set; } = null!;
        public int order { get; set; }
    }

    public class MovieWithActor
    {
        public Movie Movie { get; set; } = null!;
    }

    public class CharacterWithActor
    {
        public string char_name { get; set; } = null!;
    }
}