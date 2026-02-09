namespace CinemaAPI.Models.DTOs
{
    public class ActorResponse
    {
        public List<ActorItem> Cast { get; set; } = new();
    }

    public class ActorItem
    {
        public int Id { get; set; }
        public string name { get; set; } = null!;
        public string profile_path { get; set; } = null!;
        public string character { get; set; } = null!;
        public int order { get; set; }
        public int gender { get; set; }
    }
}