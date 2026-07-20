using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class PasswordReset
    {
        public int Id { get; set; }
        public int UserId { get; set; }

        [MaxLength(450)]
        public string Token { get; set; } = string.Empty;

        public DateTime ExpiresAt { get; set; }
        public bool Used { get; set; }
        public DateTime CreatedAt { get; set; }

        public User? User { get; set; }
    }
}