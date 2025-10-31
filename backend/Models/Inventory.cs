namespace Backend.Models;

public class Inventory
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public Product Product { get; set; } = null!;

    public int Quantity { get; set; }

    public int MinStockLevel { get; set; } = 5;

    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
}
