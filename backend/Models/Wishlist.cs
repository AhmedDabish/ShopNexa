using System;
using System.Collections.Generic;

namespace backend.Models
{
    public class Wishlist
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime CreatedAt { get; set; }

        public User User { get; set; }
        public ICollection<WishlistItem> Items { get; set; }
    }
}