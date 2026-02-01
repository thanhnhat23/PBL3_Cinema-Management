public class TmdbConfig
{
    public string ApiKey { get; set; } = null!;
    public string BaseUrl { get; set; } = null!;
    public string ImageBaseUrl { get; set; } = null!;
    public string YoutubeBaseUrl { get; set; } = null!;
    public Endpoints ConfigEndpoints { get; set; } = null!;
}

public class Endpoints
{
    public string NowPlaying { get; set; } = null!;
    public string Upcoming { get; set; } = null!;
    public string Popular { get; set; } = null!;
    public string Genres { get; set; } = null!;
    public string Credits { get; set; } = null!;
    public string MovieDetails { get; set; } = null!;
    public string Videos { get; set; } = null!;
}