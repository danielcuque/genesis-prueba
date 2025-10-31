namespace Backend.Models;

public class Combo
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public bool IsEditable { get; set; } = true;

    public bool IsSeasonal { get; set; } = false;

    public DateTime? ValidFrom { get; set; }

    public DateTime? ValidTo { get; set; }

    public ICollection<ComboItem> ComboItems { get; set; } = new List<ComboItem>();
}
