using backend.Models;

public class Address
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Street { get; set; }
    public string City { get; set; }
    public string State { get; set; }
    public string ZipCode { get; set; }
    public string Country { get; set; }
    public bool IsDefault { get; set; }
    public User User { get; set; }
}