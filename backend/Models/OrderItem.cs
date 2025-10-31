namespace Backend.Models;

public class OrderItem
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public Order Order { get; set; } = null!;

    public int ProductId { get; set; }

    public Product Product { get; set; } = null!;

    public int Quantity { get; set; }

    public decimal Price { get; set; } // price at time of order

    public string Customizations { get; set; } = string.Empty; // JSON string for selected customizations

}
