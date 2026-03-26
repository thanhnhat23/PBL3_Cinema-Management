using System.ComponentModel.DataAnnotations;

namespace CinemaAPI.Models.DTOs
{
    public class CinemaCreateRequest
    {
        public int location_id { get; set; }
        public string name { get; set; } = null!;
        public string address { get; set; } = null!;
        [Required]
        public string phone_number { get; set; } = null!;
        public decimal latitude { get; set; }
        public decimal longitude { get; set; }
        public string? description { get; set; } = null;
        public string image_overview { get; set; } = null!;

    }

      public class CinemaUpdateRequest
    {
        public int location_id { get; set; }
        public string name { get; set; } = null!;
        public string address { get; set; } = null!;
                [Required]
                public string phone_number { get; set; } = null!;
        public decimal latitude { get; set; }
        public decimal longitude { get; set; }
        public string? description { get; set; } = null;
        public string image_overview { get; set; } = null!;

    }
}