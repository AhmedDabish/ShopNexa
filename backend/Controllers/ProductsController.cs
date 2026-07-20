//////using Microsoft.Extensions.Hosting;
//////using static System.Net.Mime.MediaTypeNames;

//////GET / api / products - قائمة المنتجات(مع Filter & Search & Pagination)
//////GET / api / products /{ id}
//////-تفاصيل منتج واحد
//////GET    /api/products/category/{id}     -منتجات حسب الفئة
//////GET    /api/products/featured          - منتجات مميزة
//////GET    /api/products/search?q=         - بحث عن منتجات
//////POST   /api/products                   - إضافة منتج (Seller/Admin)
//////PUT    /api/products/{id}              -تحديث منتج
//////DELETE /api/products/{id}              -حذف منتج(Soft Delete)
//////POST / api / products /{ id}/ images - رفع صور للمنتج
//////DELETE /api/products/images/{id}       -
//////حذف صورة



////using Microsoft.AspNetCore.Mvc;
////using backend.Services;
////using backend.DTOs;

////namespace backend.Controllers
////{
////    [Route("api/[controller]")]
////    [ApiController]
////    public class ProductsController : ControllerBase
////    {
////        private readonly ProductService _productService;

////        public ProductsController(ProductService productService)
////        {
////            _productService = productService;
////        }

////        [HttpGet]
////        public async Task<IActionResult> GetAll()
////        {
////            var products = await _productService.GetAllProductsAsync();
////            return Ok(products);
////        }

////        [HttpGet("{id}")]
////        public async Task<IActionResult> GetById(int id)
////        {
////            var product = await _productService.GetProductByIdAsync(id);
////            if (product == null) return NotFound();
////            return Ok(product);
////        }
////    }
////}

//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using backend.Services;
//using backend.DTOs;
//using backend.Models;
//using System.Security.Claims;

//namespace backend.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class ProductsController : ControllerBase
//    {
//        private readonly ProductService _productService;

//        public ProductsController(ProductService productService)
//        {
//            _productService = productService;
//        }

//        private int? GetUserIdOrNull()
//        {
//            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
//            return int.TryParse(claim, out var id) ? id : null;
//        }

//        [HttpGet]
//        public async Task<IActionResult> GetAll()
//        {
//            var products = await _productService.GetAllProductsAsync();
//            return Ok(products);
//        }

//        [HttpGet("{id}")]
//        public async Task<IActionResult> GetById(int id)
//        {
//            var product = await _productService.GetProductByIdAsync(id);
//            if (product == null) return NotFound();
//            return Ok(product);
//        }

//        [HttpPost]
//        [Authorize(Roles = "Admin,Seller")]
//        public async Task<IActionResult> Create([FromForm] CreateProductDto dto)
//        {
//            if (dto == null) return BadRequest(new { message = "Invalid product data" });

//            var sellerId = GetUserIdOrNull();
//            var isSeller = User.IsInRole("Seller");

//            var product = new Product
//            {
//                Name = dto.Name,
//                Description = dto.Description ?? "",
//                Price = dto.Price,
//                DiscountPrice = dto.DiscountPrice,
//                StockQuantity = dto.StockQuantity,
//                SKU = dto.SKU ?? $"SKU-{Guid.NewGuid().ToString("N").Substring(0, 8)}",
//                CategoryId = dto.CategoryId,
//                SellerId = isSeller ? sellerId : null,
//                IsActive = dto.IsActive,
//                CreatedAt = DateTime.UtcNow,
//                Images = new List<ProductImage>()
//            };

//            var created = await _productService.CreateProductAsync(product);
//            return Ok(new { id = created.Id, message = "Product created" });
//        }

//        [HttpPut("{id}")]
//        [Authorize(Roles = "Admin,Seller")]
//        public async Task<IActionResult> Update(int id, [FromBody] CreateProductDto dto)
//        {
//            if (dto == null) return BadRequest(new { message = "Invalid product data" });

//            var ok = await _productService.UpdateProductAsync(id, dto);
//            if (!ok) return NotFound();
//            return Ok(new { message = "Product updated" });
//        }

//        [HttpDelete("{id}")]
//        [Authorize(Roles = "Admin,Seller")]
//        public async Task<IActionResult> Delete(int id)
//        {
//            var ok = await _productService.DeleteProductAsync(id);
//            if (!ok) return NotFound();
//            return Ok(new { message = "Product deleted" });
//        }
//    }
//}


using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.DTOs;
using backend.Models;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ProductService _productService;
        private readonly IWebHostEnvironment _env;

        public ProductsController(ProductService productService, IWebHostEnvironment env)
        {
            _productService = productService;
            _env = env;
        }

        private int? GetUserIdOrNull()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(claim, out var id) ? id : null;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _productService.GetAllProductsAsync();
            return Ok(products);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);
            if (product == null) return NotFound();
            return Ok(product);
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Seller")]
        public async Task<IActionResult> Create([FromForm] CreateProductDto dto, [FromForm] List<IFormFile>? images)
        {
            if (dto == null) return BadRequest(new { message = "Invalid product data" });

            var sellerId = GetUserIdOrNull();
            var isSeller = User.IsInRole("Seller");

            // ١) ارفع الصور إلى wwwroot/uploads/products
            var imageList = new List<ProductImage>();
            if (images != null && images.Count > 0)
            {
                var webRoot = _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var uploadsDir = Path.Combine(webRoot, "uploads", "products");
                Directory.CreateDirectory(uploadsDir);

                for (int i = 0; i < images.Count; i++)
                {
                    var file = images[i];
                    if (file == null || file.Length == 0) continue;

                    var ext = Path.GetExtension(file.FileName);
                    var fileName = $"{Guid.NewGuid():N}{ext}";
                    var fullPath = Path.Combine(uploadsDir, fileName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    var publicUrl = $"/uploads/products/{fileName}";
                    imageList.Add(new ProductImage
                    {
                        ImageUrl = publicUrl,
                        IsPrimary = i == 0,
                        DisplayOrder = i
                    });
                }
            }

            var product = new Product
            {
                Name = dto.Name,
                Description = dto.Description ?? "",
                Price = dto.Price,
                DiscountPrice = dto.DiscountPrice,
                StockQuantity = dto.StockQuantity,
                SKU = dto.SKU ?? $"SKU-{Guid.NewGuid().ToString("N").Substring(0, 8)}",
                CategoryId = dto.CategoryId,
                SellerId = isSeller ? sellerId : null,
                IsActive = dto.IsActive,
                CreatedAt = DateTime.UtcNow,
                Images = imageList
            };

            var created = await _productService.CreateProductAsync(product);
            return Ok(new { id = created.Id, message = "Product created" });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Seller")]
        public async Task<IActionResult> Update(int id, [FromBody] CreateProductDto dto)
        {
            if (dto == null) return BadRequest(new { message = "Invalid product data" });
            var ok = await _productService.UpdateProductAsync(id, dto);
            if (!ok) return NotFound();
            return Ok(new { message = "Product updated" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Seller")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _productService.DeleteProductAsync(id);
            if (!ok) return NotFound();
            return Ok(new { message = "Product deleted" });
        }
    }
}