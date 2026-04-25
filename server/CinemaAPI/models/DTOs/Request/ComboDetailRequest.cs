namespace CinemaAPI.Models.DTOs
{
    public class ComboDetailCreateRequest
    {
        public int combo_id { get; set; }
        public int snack_id { get; set; }
        public int quantity { get; set; }
    }

    public class ComboDetailUpdateRequest
    {
        public int? quantity { get; set; }
    }
}
