namespace CinemaAPI.Models
{
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
        public string MovieReviews { get; set; } = null!;
    }

    public class GeminiConfig
    {
        public string ApiKey { get; set; } = null!;
        public string Model { get; set; } = "gemini-2.5-flash";
    }

    public class CloudinaryConfig
    {
        public string CloudName { get; set; } = null!;
        public string ApiKey { get; set; } = null!;
        public string ApiSecret { get; set; } = null!;
    }

    public class VnpayConfig
    {
        public string vnp_TmnCode { get; set; } = null!;
        public string vnp_HashSecret { get; set; } = null!;
        public string vnp_Url { get; set; } = null!;
        public string vnp_Api { get; set; } = null!;
        public string vnp_ReturnUrl { get; set; } = null!;
        public string vnp_Version { get; set; } = null!;
        public string vnp_Command { get; set; } = null!;
        public string vnp_CurrCode { get; set; } = null!;
        public string vnp_Locale { get; set; } = null!;
    }
}