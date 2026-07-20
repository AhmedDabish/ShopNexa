using backend.Data;
using backend.DTOs.Auth;
using backend.Models;
using backend.Repositories.Interfaces;
using backend.Helpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Security.Cryptography;
using System.Text;
using Google.Apis.Auth;

namespace backend.Services
{
    public class AuthService
    {
        private readonly IUserRepository _userRepo;
        private readonly JwtHelper _jwtHelper;
        private readonly EmailHelper _emailHelper;
        private readonly AppDbContext _db;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;

        public AuthService(
            IUserRepository userRepo,
            JwtHelper jwtHelper,
            EmailHelper emailHelper,
            AppDbContext db,
            IConfiguration configuration,
            ILogger<AuthService> logger)
        {
            _userRepo = userRepo;
            _jwtHelper = jwtHelper;
            _emailHelper = emailHelper;
            _db = db;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<(bool Success, string Message, User? User, string? Token)> RegisterAsync(RegisterDto dto)
        {
            if (await _userRepo.ExistsAsync(u => u.Email == dto.Email))
                return (false, "Email already exists", null, null);

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PhoneNumber = dto.PhoneNumber,
                PasswordHash = HashPassword(dto.Password),
                RoleId = dto.Role == "Seller" ? 2 : 1,
                CreatedAt = DateTime.UtcNow,
                IsActive = true,
                IsEmailConfirmed = false,
                EmailConfirmationToken = GenerateRandomToken()
            };

            await _userRepo.AddAsync(user);
            await _emailHelper.SendConfirmationEmail(user.Email, user.EmailConfirmationToken!);
            return (true, "Registered successfully. Please confirm your email.", user, null);
        }

        public async Task<(bool Success, string Message, User? User, string? Token)> LoginAsync(LoginDto dto)
        {
            var user = await _userRepo.GetByEmailAsync(dto.Email);
            if (user == null || !VerifyPassword(dto.Password, user.PasswordHash))
                return (false, "Invalid email or password", null, null);
            if (!user.IsActive)
                return (false, "Account is inactive", null, null);

            user.LastLogin = DateTime.UtcNow;
            await _userRepo.UpdateAsync(user);

            var token = _jwtHelper.GenerateToken(user);
            return (true, "Login successful", user, token);
        }

        public async Task<(bool Success, string Message)> ConfirmEmailAsync(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
                return (false, "Invalid activation link");

            var user = await _db.Users.FirstOrDefaultAsync(u => u.EmailConfirmationToken == token);
            if (user == null)
                return (false, "Invalid or expired activation link");

            user.IsEmailConfirmed = true;
            user.EmailConfirmationToken = null;
            await _userRepo.UpdateAsync(user);
            return (true, "Email confirmed successfully");
        }

        public async Task ForgotPasswordAsync(string email)
        {
            var user = await _userRepo.GetByEmailAsync(email);
            if (user == null) return;

            var oldTokens = await _db.PasswordResets
                .Where(r => r.UserId == user.Id && !r.Used && r.ExpiresAt > DateTime.UtcNow)
                .ToListAsync();
            foreach (var t in oldTokens) t.Used = true;

            var reset = new PasswordReset
            {
                UserId = user.Id,
                Token = GenerateRandomToken(),
                ExpiresAt = DateTime.UtcNow.AddHours(1),
                Used = false,
                CreatedAt = DateTime.UtcNow
            };
            _db.PasswordResets.Add(reset);
            await _db.SaveChangesAsync();

            await _emailHelper.SendPasswordResetEmail(user.Email, reset.Token);
        }

        public async Task<(bool Success, string Message)> ResetPasswordAsync(string token, string newPassword)
        {
            if (string.IsNullOrWhiteSpace(token) || string.IsNullOrWhiteSpace(newPassword))
                return (false, "Invalid request");

            var reset = await _db.PasswordResets
                .Include(r => r.User)
                .FirstOrDefaultAsync(r => r.Token == token);

            if (reset == null || reset.Used || reset.ExpiresAt < DateTime.UtcNow || reset.User == null)
                return (false, "Invalid or expired reset link");

            reset.User.PasswordHash = HashPassword(newPassword);
            reset.Used = true;
            await _db.SaveChangesAsync();

            return (true, "Password changed successfully");
        }

        public async Task<(bool Success, string Message, User? User, string? Token)> GoogleLoginAsync(string idToken)
        {
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { _configuration["Google:ClientId"] }
                };
                var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);

                if (payload == null)
                    return (false, "Invalid Google token", null, null);

                var email = payload.Email;
                var name = payload.Name;
                var picture = payload.Picture;

                var user = await _userRepo.GetByEmailAsync(email);

                if (user == null)
                {
                    user = new User
                    {
                        FullName = name,
                        Email = email,
                        PhoneNumber = "",
                        PasswordHash = HashPassword(Guid.NewGuid().ToString()),
                        RoleId = 1,
                        CreatedAt = DateTime.UtcNow,
                        IsActive = true,
                        IsEmailConfirmed = true,
                        ProfileImage = picture
                    };
                    await _userRepo.AddAsync(user);
                }
                else if (!user.IsActive)
                {
                    return (false, "Account is inactive", null, null);
                }

                if (string.IsNullOrEmpty(user.ProfileImage) && !string.IsNullOrEmpty(picture))
                {
                    user.ProfileImage = picture;
                    await _userRepo.UpdateAsync(user);
                }

                user.LastLogin = DateTime.UtcNow;
                await _userRepo.UpdateAsync(user);

                var token = _jwtHelper.GenerateToken(user);
                return (true, "Google login successful", user, token);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Google login failed");
                return (false, "Invalid Google token", null, null);
            }
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }

        private bool VerifyPassword(string password, string hash)
            => HashPassword(password) == hash;

        private string GenerateRandomToken()
        {
            var bytes = RandomNumberGenerator.GetBytes(32);
            return Convert.ToBase64String(bytes)
                .Replace("+", "-").Replace("/", "_").Replace("=", "");
        }
    }
}