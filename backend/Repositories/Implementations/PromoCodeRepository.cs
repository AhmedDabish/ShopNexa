using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Repositories.Implementations
{
    public class PromoCodeRepository : GenericRepository<PromoCode>, IPromoCodeRepository
    {
        public PromoCodeRepository(AppDbContext context) : base(context) { }

        public async Task<PromoCode?> GetByCodeAsync(string code)
            => await _dbSet.FirstOrDefaultAsync(p => p.Code == code);
    }
}