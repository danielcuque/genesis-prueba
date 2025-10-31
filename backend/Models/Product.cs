using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Product
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    [Required]
    public decimal Price { get; set; }

    public string Category { get; set; } = string.Empty; // tamale or drink

    public string ImageUrl { get; set; } = string.Empty;

    public bool IsVegetarian { get; set; }

    public bool IsAvailable { get; set; } = true;

    // Navigation
    public Inventory? Inventory { get; set; }
}
