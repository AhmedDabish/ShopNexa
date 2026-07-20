////POST / api / auth / register - تسجيل مستخدم جديد
////POST   /api/auth/login                 - تسجيل الدخول
////POST   /api/auth/confirm-email         - تأكيد البريد الإلكتروني
////POST   /api/auth/forgot-password       - نسيت كلمة المرور
////POST   /api/auth/reset-password        - إعادة تعيين كلمة المرور
////POST   /api/auth/refresh-token         - تحديث الـ Token
////POST   /api/auth/logout                - تسجيل الخروج
////POST   /api/auth/google-login          - (Bonus) تسجيل دخول Google


//using backend.DTOs.Auth;
//using backend.Services;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Mvc;

//namespace backend.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class AuthController : ControllerBase
//    {
//        private readonly AuthService _authService;

//        public AuthController(AuthService authService)
//        {
//            _authService = authService;
//        }

//        [HttpPost("register")]
//        public async Task<IActionResult> Register(RegisterDto dto)
//        {
//            var result = await _authService.RegisterAsync(dto);
//            if (!result.Success) return BadRequest(new { message = result.Message });
//            return Ok(new { message = result.Message });
//        }

//        [HttpPost("login")]
//        public async Task<IActionResult> Login(LoginDto dto)
//        {
//            var result = await _authService.LoginAsync(dto);
//            if (!result.Success) return Unauthorized(new { message = result.Message });
//            return Ok(new { token = result.Token, user = result.User });
//        }

//        //[HttpPost("login")]
//        //public async Task<IActionResult> Login(LoginDto dto)
//        //{
//        //    var result = await _authService.LoginAsync(dto);
//        //    if (!result.Success) return Unauthorized(new { message = result.Message });

//        //    return Ok(new
//        //    {
//        //        token = result.Token,
//        //        user = result.User,
//        //        // Test credentials info
//        //        testAccounts = new[]
//        //        {
//        //    new { role = "Customer", email = "customer@test.com", password = "Test@123" },
//        //    new { role = "Seller",   email = "seller@test.com",   password = "Test@123" },
//        //    new { role = "Admin",    email = "admin@test.com",    password = "Test@123" }
//        //}
//        //    });
//        //}
//        [HttpGet("hash")]
//        [AllowAnonymous]
//        public IActionResult GetHash()
//        {
//            return Ok(BCrypt.Net.BCrypt.HashPassword("Test@123"));
//        }
//    }
//}


using backend.DTOs.Auth;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var result = await _authService.RegisterAsync(dto);
            if (!result.Success) return BadRequest(new { message = result.Message });
            return Ok(new { message = result.Message });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var result = await _authService.LoginAsync(dto);
            if (!result.Success) return Unauthorized(new { message = result.Message });
            return Ok(new { token = result.Token, user = result.User });
        }

        [HttpPost("confirm-email")]
        public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailDto dto)
        {
            var result = await _authService.ConfirmEmailAsync(dto.Token);
            if (!result.Success) return BadRequest(new { message = result.Message });
            return Ok(new { message = result.Message });
        }

        // Always returns 200 OK — we don't reveal whether the email exists.
        // The frontend already shows "If the email exists, you'll receive a link".
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            await _authService.ForgotPasswordAsync(dto.Email);
            return Ok(new { message = "If the email exists, a reset link has been sent." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var result = await _authService.ResetPasswordAsync(dto.Token, dto.NewPassword);
            if (!result.Success) return BadRequest(new { message = result.Message });
            return Ok(new { message = result.Message });
        }

        [HttpGet("hash")]
        [AllowAnonymous]
        public IActionResult GetHash()
        {
            return Ok(BCrypt.Net.BCrypt.HashPassword("Test@123"));
        }
        [HttpPost("google-login")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto dto)
        {
            var result = await _authService.GoogleLoginAsync(dto.IdToken);
            if (!result.Success)
                return Unauthorized(new { message = result.Message });
            return Ok(new { token = result.Token, user = result.User });
        }
    }
}