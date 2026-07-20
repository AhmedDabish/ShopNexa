public class CartItem
{
    public int Id { get; set; }
    public int CartId { get; set; }
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public decimal PriceAtAdd { get; set; } // السعر وقت الإضافة
    public DateTime AddedAt { get; set; }

    public Cart Cart { get; set; }
    public Product Product { get; set; }
}