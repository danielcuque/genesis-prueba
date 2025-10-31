using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Order
{
    public int Id { get; set; }

    [Required]
    public string CustomerName { get; set; } = string.Empty;

    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Phone]
    public string Phone { get; set; } = string.Empty;

    public decimal Total { get; set; }

    public string Status { get; set; } = "Pending"; // Pending, Confirmed, Preparing, Ready, Delivered

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
