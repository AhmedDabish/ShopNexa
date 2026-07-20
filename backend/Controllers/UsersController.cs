using backend.Data;
using backend.DTOs;
using backend.Repositories.Interfaces;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IWebHostEnvironment _env;
        private readonly UserService _userService;
        private readonly IUserRepository _userRepo;
        private readonly IAddressRepository _addressRepo;

        public UsersController(
            UserService userService,
            IUserRepository userRepo,
            IAddressRepository addressRepo,
            AppDbContext db,
            IWebHostEnvironment env)
        {
            _db = db;
            _userService = userService;
            _userRepo = userRepo;
            _addressRepo = addressRepo;
            _env = env; // ✅ FIX: مهم جدًا
        }

        // 🔥 الأفضل توحيد الـ claim هنا
        private int GetUserId()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(claim);
        }

        // ================= PROFILE =================

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var user = await _userRepo.GetUserWithDetailsAsync(GetUserId());
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile(UpdateProfileDto dto)
        {
            var user = await _userService.UpdateProfileAsync(GetUserId(), dto);
            return Ok(user);
        }

        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto dto)
        {
            var result = await _userService.ChangePasswordAsync(GetUserId(), dto);

            if (!result)
                return BadRequest(new { message = "Old password is incorrect" });

            return Ok(new { message = "Password changed successfully" });
        }

        // ================= ADDRESSES =================

        [HttpGet("addresses")]
        public async Task<IActionResult> GetAddresses()
        {
            var user = await _userRepo.GetUserWithDetailsAsync(GetUserId());
            return Ok(user?.Addresses);
        }

        [HttpPost("addresses")]
        public async Task<IActionResult> AddAddress(CreateAddressDto dto)
        {
            var user = await _userRepo.GetUserWithDetailsAsync(GetUserId());

            var address = new Address
            {
                UserId = GetUserId(),
                Street = dto.Street,
                City = dto.City,
                State = dto.State,
                ZipCode = dto.ZipCode,
                Country = dto.Country,
                IsDefault = dto.IsDefault
            };

            if (address.IsDefault && user?.Addresses != null)
            {
                foreach (var a in user.Addresses)
                    a.IsDefault = false;
            }

            await _addressRepo.AddAsync(address);

            return Ok(address);
        }

        [HttpPut("addresses/{id}")]
        public async Task<IActionResult> UpdateAddress(int id, CreateAddressDto dto)
        {
            var address = await _addressRepo.GetByIdAsync(id);

            if (address == null || address.UserId != GetUserId())
                return NotFound();

            address.Street = dto.Street;
            address.City = dto.City;
            address.State = dto.State;
            address.ZipCode = dto.ZipCode;
            address.Country = dto.Country;
            address.IsDefault = dto.IsDefault;

            await _addressRepo.UpdateAsync(address);

            return Ok(address);
        }

        [HttpDelete("addresses/{id}")]
        public async Task<IActionResult> DeleteAddress(int id)
        {
            var address = await _addressRepo.GetByIdAsync(id);

            if (address == null || address.UserId != GetUserId())
                return NotFound();

            await _addressRepo.DeleteAsync(address);

            return NoContent();
        }

        // ================= WALLET =================

        [HttpGet("wallet")]
        public async Task<IActionResult> GetWallet()
        {
            var user = await _userRepo.GetByIdAsync(GetUserId());
            return Ok(new { balance = user?.WalletBalance ?? 0 });
        }

        // ================= PROFILE IMAGE =================

        [HttpPost("profile/image")]
        public async Task<IActionResult> UploadProfileImage(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file uploaded" });

            var allowed = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();

            if (!allowed.Contains(ext))
                return BadRequest(new { message = "Invalid image format" });

            const long maxSize = 5 * 1024 * 1024;

            if (file.Length > maxSize)
                return BadRequest(new { message = "Max size is 5MB" });

            var userId = GetUserId();

            var user = await _db.Users.FindAsync(userId);

            if (user == null)
                return NotFound();

            var uploadsRoot = Path.Combine(
                _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"),
                "uploads",
                "profiles"
            );

            Directory.CreateDirectory(uploadsRoot);

            var fileName = $"{Guid.NewGuid():N}{ext}";
            var fullPath = Path.Combine(uploadsRoot, fileName);

            using (var stream = new FileStream(fullPath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // حذف الصورة القديمة
            if (!string.IsNullOrEmpty(user.ProfileImage) &&
                user.ProfileImage.StartsWith("/uploads/profiles/"))
            {
                var oldPath = Path.Combine(uploadsRoot, Path.GetFileName(user.ProfileImage));

                if (System.IO.File.Exists(oldPath))
                {
                    try { System.IO.File.Delete(oldPath); } catch { }
                }
            }

            user.ProfileImage = $"/uploads/profiles/{fileName}";
            await _db.SaveChangesAsync();

            return Ok(new { profileImage = user.ProfileImage });
        }

        [HttpDelete("profile/image")]
        public async Task<IActionResult> RemoveProfileImage()
        {
            var userId = GetUserId();

            var user = await _db.Users.FindAsync(userId);

            if (user == null)
                return NotFound();

            if (!string.IsNullOrEmpty(user.ProfileImage))
            {
                var uploadsRoot = Path.Combine(
                    _env.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot"),
                    "uploads",
                    "profiles"
                );

                var oldPath = Path.Combine(uploadsRoot, Path.GetFileName(user.ProfileImage));

                if (System.IO.File.Exists(oldPath))
                {
                    try { System.IO.File.Delete(oldPath); } catch { }
                }
            }

            user.ProfileImage = null;
            await _db.SaveChangesAsync();

            return Ok();
        }
    }
}