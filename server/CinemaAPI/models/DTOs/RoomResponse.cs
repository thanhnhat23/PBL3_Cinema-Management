public class RoomResponse
{
    public int room_id { get; set; }
    public string nameRoom { get; set; } = null!;
    public string roomLayoutType { get; set; } = null!;
    public decimal price { get; set; }
    public int row { get; set; }
    public int column { get; set; }
    public List<SeatResponse> Seats { get; set; } = new();
}

public class SeatResponse
{
    public int seat_id { get; set; }
    public int rowNumber { get; set; }
    public int columnNumber { get; set; }
    public string seatCode { get; set; } = null!;
    public string type { get; set; } = null!;
}