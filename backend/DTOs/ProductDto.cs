////namespace backend.DTOs
////{
////    public class ProductDto
////    {
////        public int Id { get; set; }
////        public string Name { get; set; }
////        public string Description { get; set; }
////        public decimal Price { get; set; }
////        public decimal? DiscountPrice { get; set; }
////        public int StockQuantity { get; set; }
////        public int CategoryId { get; set; }
////        public List<string> ImageUrls { get; set; }
////    }
////}


//namespace backend.DTOs
//{
//    public class ProductDto
//    {
//        public int Id { get; set; }
//        public string Name { get; set; }
//        public string Description { get; set; }
//        public decimal Price { get; set; }
//        public decimal? DiscountPrice { get; set; }
//        public int StockQuantity { get; set; }
//        public int CategoryId { get; set; }
//        public double AverageRating { get; set; }
//        public string? CategoryName { get; set; }
//        public List<ProductImageDto> Images { get; set; } = new();
//    }

//    public class ProductImageDto
//    {
//        public int Id { get; set; }
//        public string ImageUrl { get; set; }
//        public bool IsPrimary { get; set; }
//        public int DisplayOrder { get; set; }
//    }
//}

namespace backend.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public decimal? DiscountPrice { get; set; }
        public int StockQuantity { get; set; }
        public int CategoryId { get; set; }
        public double AverageRating { get; set; }
        public string? CategoryName { get; set; }
        public List<ProductImageDto> Images { get; set; } = new();
    }

    public class ProductImageDto
    {
        public int Id { get; set; }
        public string ImageUrl { get; set; }
        public bool IsPrimary { get; set; }
        public int DisplayOrder { get; set; }
    }

    public class CreateProductDto
    {
        public string Name { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public decimal? DiscountPrice { get; set; }
        public int StockQuantity { get; set; }
        public string? SKU { get; set; }
        public int CategoryId { get; set; }
        public bool IsActive { get; set; } = true;
    }
}