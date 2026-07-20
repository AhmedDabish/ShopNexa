////GET / api / seller / products - منتجات البائع
////GET    /api/seller/orders              - طلبات منتجات البائع
////GET    /api/seller/earnings            - الأرباح
////POST   /api/seller/payout              - طلب سحب

//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;
//using backend.Repositories.Interfaces;
//using System.Security.Claims;

//namespace backend.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    [Authorize(Roles = "Seller")]
//    public class SellerController : ControllerBase
//    {
//        private readonly IProductRepository _productRepo;
//        private readonly IOrderRepository _orderRepo;

//        public SellerController(IProductRepository productRepo, IOrderRepository orderRepo)
//        {
//            _productRepo = productRepo;
//            _orderRepo = orderRepo;
//        }

//        private int GetUserId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

//        [HttpGet("products")]
//        public async Task<IActionResult> GetMyProducts()
//        {
//            var products = await _productRepo.FindAsync(p => p.SellerId == GetUserId());
//            return Ok(products);
//        }

//        [HttpGet("orders")]
//        //public async Task<IActionResult> GetMyOrders()
//        //{
//        //    // جلب الطلبات التي تحتوي على منتجات البائع
//        //    var orders = await _orderRepo.GetAllOrdersWithDetailsAsync(1, 100);
//        //    var filtered = orders.Where(o => o.OrderItems.Any(oi => oi.Product.SellerId == GetUserId()));
//        //    return Ok(filtered);
//        //}

//        [HttpGet("orders")]
//        public async Task<IActionResult> GetMyOrders()
//        {
//            var sellerId = GetUserId();
//            var orders = await _orderRepo.GetAllOrdersWithDetailsAsync(1, 100);

//            var result = orders
//                .Where(o => o.OrderItems != null && o.OrderItems.Any(oi => oi.Product != null && oi.Product.SellerId == sellerId))
//                .Select(o => new
//                {
//                    id = o.Id,
//                    orderNumber = o.OrderNumber,
//                    orderDate = o.OrderDate,
//                    status = o.Status,
//                    customerName = o.User != null ? o.User.FullName : "",
//                    // المبلغ بتاع منتجات البائع بس
//                    totalAmount = o.OrderItems
//                        .Where(oi => oi.Product != null && oi.Product.SellerId == sellerId)
//                        .Sum(oi => oi.TotalPrice),
//                    items = o.OrderItems
//                        .Where(oi => oi.Product != null && oi.Product.SellerId == sellerId)
//                        .Select(oi => new {
//                            productId = oi.ProductId,
//                            productName = oi.Product.Name,
//                            quantity = oi.Quantity,
//                            unitPrice = oi.UnitPrice,
//                            totalPrice = oi.TotalPrice
//                        })
//                });

//            return Ok(result);
//        }
//        //[HttpGet("earnings")]
//        //public async Task<IActionResult> GetEarnings()
//        //{
//        //    var products = await _productRepo.FindAsync(p => p.SellerId == GetUserId());
//        //    var productIds = products.Select(p => p.Id);
//        //    var orders = await _orderRepo.GetAllOrdersWithDetailsAsync(1, 1000);
//        //    var earnings = orders.Where(o => o.Status == "Delivered")
//        //                         .SelectMany(o => o.OrderItems)
//        //                         .Where(oi => productIds.Contains(oi.ProductId))
//        //                         .Sum(oi => oi.TotalPrice);
//        //    return Ok(new { totalEarnings = earnings, pendingPayouts = 0 });
//        //}

//        [HttpGet("earnings")]
//        public async Task<IActionResult> GetEarnings()
//        {
//            var sellerId = GetUserId();
//            var products = await _productRepo.FindAsync(p => p.SellerId == sellerId);
//            var productIds = products.Select(p => p.Id).ToHashSet();

//            var orders = await _orderRepo.GetAllOrdersWithDetailsAsync(1, 1000);

//            var deliveredEarnings = orders
//                .Where(o => o.Status == "Delivered" && o.OrderItems != null)
//                .SelectMany(o => o.OrderItems)
//                .Where(oi => productIds.Contains(oi.ProductId))
//                .Sum(oi => oi.TotalPrice);

//            var pendingEarnings = orders
//                .Where(o => (o.Status == "Pending" || o.Status == "Processing" || o.Status == "Shipped") && o.OrderItems != null)
//                .SelectMany(o => o.OrderItems)
//                .Where(oi => productIds.Contains(oi.ProductId))
//                .Sum(oi => oi.TotalPrice);

//            return Ok(new
//            {
//                totalEarnings = deliveredEarnings,
//                pendingPayouts = pendingEarnings,
//                history = new object[0]
//            });
//        }


//        [HttpPost("payout")]
//        public IActionResult RequestPayout()
//        {
//            return Ok(new { message = "Payout request received" });
//        }
//    }
//}



//GET / api / seller / products - منتجات البائع
//GET    /api/seller/orders              - طلبات منتجات البائع
//GET    /api/seller/earnings            - الأرباح
//POST   /api/seller/payout              - طلب سحب

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Repositories.Interfaces;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Seller")]
    public class SellerController : ControllerBase
    {
        private readonly IProductRepository _productRepo;
        private readonly IOrderRepository _orderRepo;

        public SellerController(IProductRepository productRepo, IOrderRepository orderRepo)
        {
            _productRepo = productRepo;
            _orderRepo = orderRepo;
        }

        private int GetUserId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

        [HttpGet("products")]
        public async Task<IActionResult> GetMyProducts()
        {
            var products = await _productRepo.FindAsync(p => p.SellerId == GetUserId());
            return Ok(products);
        }

        [HttpGet("orders")]
        public async Task<IActionResult> GetMyOrders()
        {
            var sellerId = GetUserId();
            var orders = await _orderRepo.GetAllOrdersWithDetailsAsync(1, 100);

            var result = orders
                .Where(o => o.OrderItems != null && o.OrderItems.Any(oi => oi.Product != null && oi.Product.SellerId == sellerId))
                .Select(o => new
                {
                    id = o.Id,
                    orderNumber = o.OrderNumber,
                    orderDate = o.OrderDate,
                    status = o.Status,
                    customerName = o.User != null ? o.User.FullName : "",
                    totalAmount = o.OrderItems
                        .Where(oi => oi.Product != null && oi.Product.SellerId == sellerId)
                        .Sum(oi => oi.TotalPrice),
                    items = o.OrderItems
                        .Where(oi => oi.Product != null && oi.Product.SellerId == sellerId)
                        .Select(oi => new
                        {
                            productId = oi.ProductId,
                            productName = oi.Product.Name,
                            quantity = oi.Quantity,
                            unitPrice = oi.UnitPrice,
                            totalPrice = oi.TotalPrice
                        })
                });

            return Ok(result);
        }

        [HttpGet("earnings")]
        public async Task<IActionResult> GetEarnings()
        {
            var sellerId = GetUserId();
            var products = await _productRepo.FindAsync(p => p.SellerId == sellerId);
            var productIds = products.Select(p => p.Id).ToHashSet();

            var orders = await _orderRepo.GetAllOrdersWithDetailsAsync(1, 1000);

            var deliveredEarnings = orders
                .Where(o => o.Status == "Delivered" && o.OrderItems != null)
                .SelectMany(o => o.OrderItems)
                .Where(oi => productIds.Contains(oi.ProductId))
                .Sum(oi => oi.TotalPrice);

            var pendingEarnings = orders
                .Where(o => (o.Status == "Pending" || o.Status == "Processing" || o.Status == "Shipped") && o.OrderItems != null)
                .SelectMany(o => o.OrderItems)
                .Where(oi => productIds.Contains(oi.ProductId))
                .Sum(oi => oi.TotalPrice);

            return Ok(new
            {
                totalEarnings = deliveredEarnings,
                pendingPayouts = pendingEarnings,
                history = new object[0]
            });
        }

        [HttpPost("payout")]
        public IActionResult RequestPayout()
        {
            return Ok(new { message = "Payout request received" });
        }
    }
}