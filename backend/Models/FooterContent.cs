namespace backend.Models;

// Holds every editable piece of the footer in a single table. Key/value
// design instead of separate columns: adding a new footer link in the
// future is just an INSERT, no schema migration.
public class FooterContent
{
    public int Id { get; set; }

    // Logical group: "brand" | "quick_links" | "account" | "contact" | "social"
    public string Section { get; set; } = string.Empty;

    public string Label { get; set; } = string.Empty;

    // Empty for plain-text rows (e.g. the brand description).
    public string? Url { get; set; }

    // Icon name (phone/email/facebook/...) that the FE switches on.
    public string? Icon { get; set; }

    public int SortOrder { get; set; }

    public bool IsActive { get; set; } = true;
}