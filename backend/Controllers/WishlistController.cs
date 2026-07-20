
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Services;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class WishlistController : ControllerBase
    {
        private readonly WishlistService _wishlistService;

        public WishlistController(WishlistService wishlistService)
        {
            _wishlistService = wishlistService;
        }

        private int GetUserId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);

        //[HttpGet]
        //public async Task<IActionResult> GetWishlist()
        //{
        //    var wishlist = await _wishlistService.GetWishlistAsync(GetUserId());
        //    return Ok(wishlist.Items.Select(i => i.Product));
        //}
        [HttpGet]
        public async Task<IActionResult> GetWishlist()
        {
            var wishlist = await _wishlistService.GetWishlistAsync(GetUserId());
            var items = wishlist.Items?.Select(i => new {
                productId = i.ProductId,
                product = i.Product
            }) ?? Enumerable.Empty<object>();
            return Ok(new { items });
        }
        //[HttpPost("items")]
        //public async Task<IActionResult> AddToWishlist([FromBody] int productId)
        //{
        //    await _wishlistService.AddToWishlistAsync(GetUserId(), productId);
        //    return Ok(new { message = "Added to wishlist" });
        //}

        public class AddWishlistItemDto
        {
            public int ProductId { get; set; }
        }

        [HttpPost("items")]
        public async Task<IActionResult> AddToWishlist([FromBody] AddWishlistItemDto dto)
        {
            if (dto == null || dto.ProductId <= 0)
                return BadRequest(new { message = "ProductId is required" });

            await _wishlistService.AddToWishlistAsync(GetUserId(), dto.ProductId);
            return Ok(new { message = "Added to wishlist", productId = dto.ProductId });
        }

        [HttpDelete("items/{productId}")]
        public async Task<IActionResult> RemoveFromWishlist(int productId)
        {
            await _wishlistService.RemoveFromWishlistAsync(GetUserId(), productId);
            return NoContent();
        }
    }
}