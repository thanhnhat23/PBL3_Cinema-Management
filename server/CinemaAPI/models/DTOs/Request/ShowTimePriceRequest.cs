namespace CinemaAPI.Models.DTOs
{
    public class ShowTimePriceCreateRequest
    {
        public int type_id { get; set; }
        public int slot_id { get; set; }
        public decimal base_price { get; set; }
    }

    public class ShowTimePriceUpdateRequest
    {
        public decimal? base_price { get; set; }
    }
}
