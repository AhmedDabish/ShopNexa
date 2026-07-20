//using System.Net;
//using System.Net.Mail;
//using Microsoft.Extensions.Configuration;
//using Microsoft.Extensions.Logging;

//namespace backend.Helpers
//{
//    public class EmailHelper
//    {
//        private readonly IConfiguration _config;
//        private readonly ILogger<EmailHelper> _logger;

//        public EmailHelper(IConfiguration config, ILogger<EmailHelper> logger)
//        {
//            _config = config;
//            _logger = logger;
//        }

//        // URL-encode the token so '+' / '/' / '=' from Base64 don't break the link.
//        public Task SendConfirmationEmail(string toEmail, string token)
//        {
//            var encoded = Uri.EscapeDataString(token);
//            var link = $"http://ecommerce129angular.runasp.net/auth/confirm-email?token={encoded}";
//            var body = $@"
//                <div style='font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px'>
//                  <h2 style='color:#111827'>Confirm your email</h2>
//                  <p>Click the button below to confirm your email address.</p>
//                  <p><a href='{link}' style='display:inline-block;padding:10px 20px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none'>Confirm Email</a></p>
//                  <p style='color:#6b7280;font-size:12px'>Or open this link manually: {link}</p>
//                </div>";
//            return SendEmail(toEmail, "Confirm your email", body);
//        }

//        public Task SendPasswordResetEmail(string toEmail, string token)
//        {
//            var encoded = Uri.EscapeDataString(token);
//            var link = $"http://ecommerce129angular.runasp.net/auth/reset-password?token={encoded}";
//            var body = $@"
//                <div style='font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px'>
//                  <h2 style='color:#111827'>Reset your password</h2>
//                  <p>We received a request to reset your password. Click the button below to set a new one.</p>
//                  <p><a href='{link}' style='display:inline-block;padding:10px 20px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none'>Reset Password</a></p>
//                  <p style='color:#6b7280;font-size:12px'>This link expires in 1 hour. If you didn't request this, ignore this email.</p>
//                  <p style='color:#6b7280;font-size:12px'>Or open this link manually: {link}</p>
//                </div>";
//            return SendEmail(toEmail, "Reset your password", body);
//        }

//        private async Task SendEmail(string to, string subject, string body)
//        {
//            try
//            {
//                var host = _config["Email:Host"];
//                var port = int.Parse(_config["Email:Port"] ?? "587");
//                var username = _config["Email:Username"];
//                var password = _config["Email:Password"];
//                var from = _config["Email:From"] ?? username;

//                using var client = new SmtpClient(host, port)
//                {
//                    Credentials = new NetworkCredential(username, password),
//                    EnableSsl = true
//                };
//                var mail = new MailMessage(from!, to, subject, body) { IsBodyHtml = true };
//                await client.SendMailAsync(mail);
//                _logger.LogInformation("Email sent to {To} with subject '{Subject}'", to, subject);
//            }
//            catch (Exception ex)
//            {
//                // Don't bubble the SMTP error to the caller — for the forgot-password
//                // flow we always want to return 200 OK to avoid leaking which emails
//                // exist. Just log it so the admin can diagnose later.
//                _logger.LogError(ex, "Failed to send email to {To}: {Message}", to, ex.Message);
//            }
//        }
//    }
//}


using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace backend.Helpers
{
    public class EmailHelper
    {
        private readonly IConfiguration _config;
        private readonly ILogger<EmailHelper> _logger;

        public EmailHelper(IConfiguration config, ILogger<EmailHelper> logger)
        {
            _config = config;
            _logger = logger;
        }

        // The frontend base URL is read from configuration so we can swap between
        // localhost (development) and the deployed Angular site without recompiling.
        // Falls back to localhost:4200 if the setting is missing.
        private string FrontendBaseUrl =>
            _config["Frontend:BaseUrl"]?.TrimEnd('/')
            ?? "http://localhost:4200";

        // URL-encode the token so '+' / '/' / '=' from Base64 don't break the link.
        public Task SendConfirmationEmail(string toEmail, string token)
        {
            var encoded = Uri.EscapeDataString(token);
            var link = $"{FrontendBaseUrl}/auth/confirm-email?token={encoded}";
            var body = $@"
                <div style='font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px'>
                  <h2 style='color:#111827'>Confirm your email</h2>
                  <p>Click the button below to confirm your email address.</p>
                  <p><a href='{link}' style='display:inline-block;padding:10px 20px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none'>Confirm Email</a></p>
                  <p style='color:#6b7280;font-size:12px'>Or open this link manually: {link}</p>
                </div>";
            return SendEmail(toEmail, "Confirm your email", body);
        }

        public Task SendPasswordResetEmail(string toEmail, string token)
        {
            var encoded = Uri.EscapeDataString(token);
            var link = $"{FrontendBaseUrl}/auth/reset-password?token={encoded}";
            var body = $@"
                <div style='font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px'>
                  <h2 style='color:#111827'>Reset your password</h2>
                  <p>We received a request to reset your password. Click the button below to set a new one.</p>
                  <p><a href='{link}' style='display:inline-block;padding:10px 20px;background:#2563eb;color:#fff;border-radius:6px;text-decoration:none'>Reset Password</a></p>
                  <p style='color:#6b7280;font-size:12px'>This link expires in 1 hour. If you didn't request this, ignore this email.</p>
                  <p style='color:#6b7280;font-size:12px'>Or open this link manually: {link}</p>
                </div>";
            return SendEmail(toEmail, "Reset your password", body);
        }

        private async Task SendEmail(string to, string subject, string body)
        {
            try
            {
                var host = _config["Email:Host"];
                var port = int.Parse(_config["Email:Port"] ?? "587");
                var username = _config["Email:Username"];
                var password = _config["Email:Password"];
                var from = _config["Email:From"] ?? username;

                using var client = new SmtpClient(host, port)
                {
                    Credentials = new NetworkCredential(username, password),
                    EnableSsl = true
                };

                var mail = new MailMessage(from!, to, subject, body) { IsBodyHtml = true };
                await client.SendMailAsync(mail);
                _logger.LogInformation("Email sent to {To} with subject '{Subject}'", to, subject);
            }
            catch (Exception ex)
            {
                // Don't bubble the SMTP error to the caller — for the forgot-password
                // flow we always want to return 200 OK to avoid leaking which emails
                // exist. Just log it so the admin can diagnose later.
                _logger.LogError(ex, "Failed to send email to {To}: {Message}", to, ex.Message);
            }
        }
    }
}