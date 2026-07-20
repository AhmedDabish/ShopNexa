using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Services;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CartController : ControllerBase
    {
        private readonly CartService _cartService;

        public CartController(CartService cartService)
        {
            _cartService = cartService;
        }

        private int GetUserId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        [HttpGet]
        public async Task<IActionResult> GetCart()
        {
            var cart = await _cartService.GetCartByUserIdAsync(GetUserId());
            if (cart == null)
                return Ok(new { cartItems = new List<object>() });
            return Ok(cart);
        }

        [HttpPost("items")]
        public async Task<IActionResult> AddItem([FromBody] AddItemRequest request)
        {
            var cart = await _cartService.AddItemToCartAsync(GetUserId(), request.ProductId, request.Quantity);
            return Ok(cart);
        }

        [HttpPut("items/{id}")]
        public async Task<IActionResult> UpdateItem(int id, [FromBody] UpdateItemRequest request)
        {
            var cart = await _cartService.UpdateCartItemQuantityAsync(GetUserId(), id, request.Quantity);
            return Ok(cart);
        }

        [HttpDelete("items/{id}")]
        public async Task<IActionResult> RemoveItem(int id)
        {
            var cart = await _cartService.RemoveCartItemAsync(GetUserId(), id);
            return Ok(cart);
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            await _cartService.ClearCartAsync(GetUserId());
            return NoContent();
        }

        public record AddItemRequest(int ProductId, int Quantity = 1);
        public record UpdateItemRequest(int Quantity);
    }
}