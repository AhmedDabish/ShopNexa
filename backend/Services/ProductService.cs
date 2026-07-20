////using backend.DTOs;
////using backend.Models;
////using backend.Repositories.Implementations;
////using backend.Repositories.Interfaces;

////namespace backend.Services
////{
////    public class ProductService
////    {
////        private readonly IProductRepository _productRepo;

////        public ProductService(IProductRepository productRepo)
////        {
////            _productRepo = productRepo;
////        }

////        //public async Task<IEnumerable<Product>> GetAllProductsAsync()
////        //    => await _productRepo.GetAllAsync();

////        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
////        {
////            var products = await _productRepo.GetAllWithImagesAsync();

////            //return products.Select(p => new ProductDto
////            //{
////            //    Id = p.Id,
////            //    Name = p.Name,
////            //    Description = p.Description,
////            //    Price = p.Price,
////            //    DiscountPrice = p.DiscountPrice,
////            //    StockQuantity = p.StockQuantity,
////            //    CategoryId = p.CategoryId,

////            //    ImageUrls = p.Images.Select(i => i.ImageUrl).ToList()
////            //});
////            return products.Select(p => new ProductDto
////            {
////                Id = p.Id,
////                Name = p.Name,
////                Description = p.Description,
////                Price = p.Price,
////                DiscountPrice = p.DiscountPrice,
////                StockQuantity = p.StockQuantity,
////                CategoryId = p.CategoryId,
////                AverageRating = p.AverageRating,
////                CategoryName = p.Category?.Name,
////                Images = p.Images.Select(i => new ProductImageDto
////                {
////                    Id = i.Id,
////                    ImageUrl = i.ImageUrl,
////                    IsPrimary = i.IsPrimary,
////                    DisplayOrder = i.DisplayOrder
////                }).ToList()
////            });
////        }
////        //public async Task<Product?> GetProductByIdAsync(int id)
////        //    => await _productRepo.GetByIdAsync(id);


////        public async Task<ProductDto?> GetProductByIdAsync(int id)
////        {
////            var product = await _productRepo.GetByIdAsync(id);

////            if (product == null) return null;

////            //return new ProductDto
////            //{
////            //    Id = product.Id,
////            //    Name = product.Name,
////            //    Description = product.Description,
////            //    Price = product.Price,
////            //    DiscountPrice = product.DiscountPrice,
////            //    StockQuantity = product.StockQuantity,
////            //    CategoryId = product.CategoryId,

////            //    ImageUrls = product.Images
////            //        .Select(i => i.ImageUrl)
////            //        .ToList()
////            //};
////            return new ProductDto
////            {
////                Id = product.Id,
////                Name = product.Name,
////                Description = product.Description,
////                Price = product.Price,
////                DiscountPrice = product.DiscountPrice,
////                StockQuantity = product.StockQuantity,
////                CategoryId = product.CategoryId,
////                AverageRating = product.AverageRating,
////                CategoryName = product.Category?.Name,
////                Images = product.Images.Select(i => new ProductImageDto
////                {
////                    Id = i.Id,
////                    ImageUrl = i.ImageUrl,
////                    IsPrimary = i.IsPrimary,
////                    DisplayOrder = i.DisplayOrder
////                }).ToList()
////            };
////        }

////        public async Task<Product> CreateProductAsync(Product product)
////            => await _productRepo.AddAsync(product);
////    }
////}



//using backend.DTOs;
//using backend.Models;
//using backend.Repositories.Implementations;
//using backend.Repositories.Interfaces;

//namespace backend.Services
//{
//    public class ProductService
//    {
//        private readonly IProductRepository _productRepo;

//        public ProductService(IProductRepository productRepo)
//        {
//            _productRepo = productRepo;
//        }

//        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
//        {
//            var products = await _productRepo.GetAllWithImagesAsync();
//            return products.Select(p => new ProductDto
//            {
//                Id = p.Id,
//                Name = p.Name,
//                Description = p.Description,
//                Price = p.Price,
//                DiscountPrice = p.DiscountPrice,
//                StockQuantity = p.StockQuantity,
//                CategoryId = p.CategoryId,
//                AverageRating = p.AverageRating,
//                CategoryName = p.Category?.Name,
//                Images = p.Images?.Select(i => new ProductImageDto
//                {
//                    Id = i.Id,
//                    ImageUrl = i.ImageUrl,
//                    IsPrimary = i.IsPrimary,
//                    DisplayOrder = i.DisplayOrder
//                }).ToList() ?? new List<ProductImageDto>()
//            });
//        }

//        public async Task<ProductDto?> GetProductByIdAsync(int id)
//        {
//            var product = await _productRepo.GetByIdAsync(id);
//            if (product == null) return null;

//            return new ProductDto
//            {
//                Id = product.Id,
//                Name = product.Name,
//                Description = product.Description,
//                Price = product.Price,
//                DiscountPrice = product.DiscountPrice,
//                StockQuantity = product.StockQuantity,
//                CategoryId = product.CategoryId,
//                AverageRating = product.AverageRating,
//                CategoryName = product.Category?.Name,
//                Images = product.Images?.Select(i => new ProductImageDto
//                {
//                    Id = i.Id,
//                    ImageUrl = i.ImageUrl,
//                    IsPrimary = i.IsPrimary,
//                    DisplayOrder = i.DisplayOrder
//                }).ToList() ?? new List<ProductImageDto>()
//            };
//        }

//        public async Task<Product> CreateProductAsync(Product product)
//            => await _productRepo.AddAsync(product);

//        public async Task<bool> UpdateProductAsync(int id, CreateProductDto dto)
//        {
//            var product = await _productRepo.GetByIdAsync(id);
//            if (product == null) return false;

//            product.Name = dto.Name ?? product.Name;
//            product.Description = dto.Description ?? product.Description;
//            product.Price = dto.Price;
//            product.DiscountPrice = dto.DiscountPrice;
//            product.StockQuantity = dto.StockQuantity;
//            product.SKU = dto.SKU ?? product.SKU;
//            product.CategoryId = dto.CategoryId;
//            product.IsActive = dto.IsActive;
//            product.UpdatedAt = DateTime.UtcNow;

//            await _productRepo.UpdateAsync(product);
//            return true;
//        }

//        public async Task<bool> DeleteProductAsync(int id)
//        {
//            var product = await _productRepo.GetByIdAsync(id);
//            if (product == null) return false;

//            // Soft delete
//            product.IsActive = false;
//            product.UpdatedAt = DateTime.UtcNow;
//            await _productRepo.UpdateAsync(product);
//            return true;
//        }
//    }
//}


using backend.DTOs;
using backend.Models;
using backend.Repositories.Implementations;
using backend.Repositories.Interfaces;

namespace backend.Services
{
    public class ProductService
    {
        private readonly IProductRepository _productRepo;
        private const string ApiBaseUrl = "https://localhost:7012";

        public ProductService(IProductRepository productRepo)
        {
            _productRepo = productRepo;
        }

        private string ResolveImageUrl(string? url)
        {
            if (string.IsNullOrEmpty(url)) return "";
            if (url.StartsWith("http")) return url;
            return $"{ApiBaseUrl}{url}";
        }

        public async Task<IEnumerable<ProductDto>> GetAllProductsAsync()
        {
            var products = await _productRepo.GetAllWithImagesAsync();
            return products.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                Description = p.Description,
                Price = p.Price,
                DiscountPrice = p.DiscountPrice,
                StockQuantity = p.StockQuantity,
                CategoryId = p.CategoryId,
                AverageRating = p.AverageRating,
                CategoryName = p.Category?.Name,
                Images = p.Images?.Select(i => new ProductImageDto
                {
                    Id = i.Id,
                    ImageUrl = ResolveImageUrl(i.ImageUrl),
                    IsPrimary = i.IsPrimary,
                    DisplayOrder = i.DisplayOrder
                }).ToList() ?? new List<ProductImageDto>()
            });
        }

        public async Task<ProductDto?> GetProductByIdAsync(int id)
        {
            var product = await _productRepo.GetByIdAsync(id);
            if (product == null) return null;

            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                DiscountPrice = product.DiscountPrice,
                StockQuantity = product.StockQuantity,
                CategoryId = product.CategoryId,
                AverageRating = product.AverageRating,
                CategoryName = product.Category?.Name,
                Images = product.Images?.Select(i => new ProductImageDto
                {
                    Id = i.Id,
                    ImageUrl = ResolveImageUrl(i.ImageUrl),
                    IsPrimary = i.IsPrimary,
                    DisplayOrder = i.DisplayOrder
                }).ToList() ?? new List<ProductImageDto>()
            };
        }

        public async Task<Product> CreateProductAsync(Product product)
            => await _productRepo.AddAsync(product);

        public async Task<bool> UpdateProductAsync(int id, CreateProductDto dto)
        {
            var product = await _productRepo.GetByIdAsync(id);
            if (product == null) return false;

            product.Name = dto.Name ?? product.Name;
            product.Description = dto.Description ?? product.Description;
            product.Price = dto.Price;
            product.DiscountPrice = dto.DiscountPrice;
            product.StockQuantity = dto.StockQuantity;
            product.SKU = dto.SKU ?? product.SKU;
            product.CategoryId = dto.CategoryId;
            product.IsActive = dto.IsActive;
            product.UpdatedAt = DateTime.UtcNow;

            await _productRepo.UpdateAsync(product);
            return true;
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            var product = await _productRepo.GetByIdAsync(id);
            if (product == null) return false;

            // Soft delete
            product.IsActive = false;
            product.UpdatedAt = DateTime.UtcNow;
            await _productRepo.UpdateAsync(product);
            return true;
        }
    }
}