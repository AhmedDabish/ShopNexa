using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IPromoCodeRepository : IGenericRepository<PromoCode>
    {
        Task<PromoCode?> GetByCodeAsync(string code);
    }
}