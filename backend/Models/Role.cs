using backend.Models;
public class Role
{
    public int Id { get; set; }
    public string Name { get; set; } // Customer, Seller, Admin
    public string Description { get; set; }
    public ICollection<User> Users { get; set; }
}