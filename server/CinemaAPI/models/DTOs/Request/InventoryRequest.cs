namespace CinemaAPI.Models.DTOs
{
    public class InventoryRequest
    {
        public int cinema_id { get; set; }
        public int snack_id { get; set; }
        public int quantity { get; set; }
    }
    
    public class InventoryUpdateRequest
    {
        public int? cinema_id { get; set; }
        public int? snack_id { get; set; }
        public int? quantity { get; set; }
    }
}