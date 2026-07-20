using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Repositories.Implementations
{
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context) { }

        public async Task<User?> GetByEmailAsync(string email)
            => await _dbSet.Include(u => u.Role).FirstOrDefaultAsync(u => u.Email == email);

        public async Task<User?> GetUserWithDetailsAsync(int id)
            => await _dbSet.Include(u => u.Role)
                           .Include(u => u.Addresses)
                           .Include(u => u.SellerProfile)
                           .FirstOrDefaultAsync(u => u.Id == id);
    }
}