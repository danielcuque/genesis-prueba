using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Customization
{
    public int Id { get; set; }

    [Required]
    public string Name { get; set; } = string.Empty;

    public string Type { get; set; } = string.Empty; // size, meat, salsa etc

    public string Options { get; set; } = string.Empty; // JSON array or comma separated

    public decimal ExtraPrice { get; set; } = 0;
}
