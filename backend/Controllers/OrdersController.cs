//using System.Threading.Channels;

//POST / api / orders - إنشاء طلب جديد
//GET    /api/orders/{id}                -تفاصيل طلب
//GET    /api/orders/user                - طلبات المستخدم
//PUT    /api/orders/{id}/ cancel - إلغاء طلب
//GET    /api/orders/{id}/ track - تتبع الطلب

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrdersController : ControllerBase
    {
        private readonly OrderService _orderService;

        public OrdersController(OrderService orderService)
        {
            _orderService = orderService;
        }

        private int GetUserId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

        [HttpPost]
        public async Task<IActionResult> CreateOrder(CreateOrderDto dto)
        {
            try
            {
                var order = await _orderService.CreateOrderAsync(GetUserId(), dto);
                return Ok(order);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetUserOrders()
        {
            var orders = await _orderService.GetUserOrdersAsync(GetUserId());
            return Ok(orders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _orderService.GetOrderByIdAsync(id, GetUserId());
            if (order == null) return NotFound();
            return Ok(order);
        }

        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            var result = await _orderService.CancelOrderAsync(id, GetUserId());
            if (!result) return BadRequest(new { message = "Cannot cancel order" });
            return Ok(new { message = "Order cancelled" });
        }

        [HttpGet("{id}/track")]
        public async Task<IActionResult> TrackOrder(int id)
        {
            var order = await _orderService.GetOrderByIdAsync(id, GetUserId());
            if (order == null) return NotFound();
            return Ok(new { status = order.Status, trackingNumber = order.TrackingNumber, shippedDate = order.ShippedDate, deliveredDate = order.DeliveredDate });
        }




        // Public endpoint — no [Authorize]. Accepts the full guest payload and
        // returns the new order so the client can show a confirmation page.
        [HttpPost("guest")]
        [AllowAnonymous]
        public async Task<IActionResult> CreateGuestOrder([FromBody] GuestCheckoutDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            try
            {
                var order = await _orderService.CreateGuestOrderAsync(dto);
                return Ok(new
                {
                    orderNumber = order.OrderNumber,
                    totalAmount = order.TotalAmount,
                    status = order.Status
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}