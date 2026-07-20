using System.Security.Cryptography;
using System.Text;
using backend.DTOs;
using backend.Models;
using backend.Repositories.Interfaces;

namespace backend.Services
{
    public class UserService
    {
        private readonly IUserRepository _userRepo;
        private readonly IAddressRepository _addressRepo; // سننشئه لاحقاً

        public UserService(IUserRepository userRepo)
        {
            _userRepo = userRepo;
        }

        public async Task<User?> GetUserByIdAsync(int id)
            => await _userRepo.GetUserWithDetailsAsync(id);

        public async Task<User> UpdateProfileAsync(int userId, UpdateProfileDto dto)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null) throw new Exception("User not found");
            user.FullName = dto.FullName;
            user.PhoneNumber = dto.PhoneNumber;
            if (!string.IsNullOrEmpty(dto.ProfileImage))
                user.ProfileImage = dto.ProfileImage;
            await _userRepo.UpdateAsync(user);
            return user;
        }

        public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto dto)
        {
            var user = await _userRepo.GetByIdAsync(userId);
            if (user == null) return false;
            if (!VerifyPassword(dto.OldPassword, user.PasswordHash))
                return false;
            user.PasswordHash = HashPassword(dto.NewPassword);
            await _userRepo.UpdateAsync(user);
            return true;
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha256.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }

        private bool VerifyPassword(string password, string hash) => HashPassword(password) == hash;
    }
}