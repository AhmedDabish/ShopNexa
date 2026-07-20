//using Microsoft.EntityFrameworkCore;
//using backend.Data;
//using backend.Repositories.Interfaces;
//using backend.Repositories.Implementations;
//using backend.Services;
//using backend.Helpers;
//using Microsoft.AspNetCore.Authentication.JwtBearer;
//using Microsoft.IdentityModel.Tokens;
//using System.Text;
//using backend.Models;

//var builder = WebApplication.CreateBuilder(args);

//// Add services to container
//builder.Services.AddControllers()
//    .AddJsonOptions(options =>
//    {
//        options.JsonSerializerOptions.ReferenceHandler =
//            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
//        options.JsonSerializerOptions.DefaultIgnoreCondition =
//            System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
//    });
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

//// Database
//builder.Services.AddDbContext<AppDbContext>(options =>
//    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

//// =========================================================
//// ✅ REGISTER ALL REPOSITORIES (MISSING ONES INCLUDED)
//// =========================================================
//builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

//builder.Services.AddScoped<IUserRepository, UserRepository>();
//builder.Services.AddScoped<IProductRepository, ProductRepository>();
//builder.Services.AddScoped<ICartRepository, CartRepository>();           // <-- THIS WAS MISSING!
//builder.Services.AddScoped<IOrderRepository, OrderRepository>();
//builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
//builder.Services.AddScoped<IWishlistRepository, WishlistRepository>();
//builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
//builder.Services.AddScoped<IAddressRepository, AddressRepository>();
//builder.Services.AddScoped<IPromoCodeRepository, PromoCodeRepository>();
//builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
//builder.Services.AddScoped<IBannerRepository, BannerRepository>();
//// =========================================================
//// ✅ REGISTER ALL SERVICES
//// =========================================================
//builder.Services.AddScoped<AuthService>();
//builder.Services.AddScoped<UserService>();
//builder.Services.AddScoped<ProductService>();
//builder.Services.AddScoped<CartService>();
//builder.Services.AddScoped<OrderService>();          // Now ICartRepository will be resolved
//builder.Services.AddScoped<PaymentService>();
//builder.Services.AddScoped<CategoryService>();
//builder.Services.AddScoped<WishlistService>();
//builder.Services.AddScoped<ReviewService>();
//builder.Services.AddScoped<BannerService>();
//// =========================================================
//// ✅ HELPERS
//// =========================================================
//builder.Services.AddSingleton<JwtHelper>();
//builder.Services.AddSingleton<EmailHelper>();

//// =========================================================
//// ✅ AUTHENTICATION (JWT)
//// =========================================================
//builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//    .AddJwtBearer(options =>
//    {
//        options.TokenValidationParameters = new TokenValidationParameters
//        {
//            ValidateIssuer = true,
//            ValidateAudience = true,
//            ValidateLifetime = true,
//            ValidateIssuerSigningKey = true,
//            ValidIssuer = builder.Configuration["Jwt:Issuer"],
//            ValidAudience = builder.Configuration["Jwt:Audience"],
//            IssuerSigningKey = new SymmetricSecurityKey(
//                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
//        };
//    });

//// =========================================================
//// ✅ CORS (Allow Angular)
//// =========================================================
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowAngular", policy =>
//        policy.WithOrigins("http://localhost:4200")
//              .AllowAnyHeader()
//              .AllowAnyMethod()
//              .AllowCredentials());
//});
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowAll", policy =>
//    {
//        policy.SetIsOriginAllowed(_ => true)
//              .AllowAnyMethod()
//              .AllowAnyHeader();
//    });
//});

//var app = builder.Build();

//// Middleware
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

//app.UseHttpsRedirection();
//app.UseCors("AllowAngular");
//app.UseStaticFiles();
//app.UseAuthentication();
//app.UseAuthorization();
//app.MapControllers();

//app.UseCors("AllowAll");


//using (var scope = app.Services.CreateScope())
//{
//    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

//    if (!context.Users.Any(u => u.Email == "admin@test.com"))
//    {
//        var users = new[]
//        {
//            new backend.Models.User
//            {
//                FullName = "Test Admin",
//                Email = "admin@test.com",
//                PhoneNumber = "01000000003",
//                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test@123"),
//                IsActive = true,
//                IsEmailConfirmed = true,
//                CreatedAt = DateTime.UtcNow,
//                WalletBalance = 0,
//                RoleId = 3
//            },
//            new backend.Models.User
//            {
//                FullName = "Test Seller",
//                Email = "seller@test.com",
//                PhoneNumber = "01000000002",
//                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test@123"),
//                IsActive = true,
//                IsEmailConfirmed = true,
//                CreatedAt = DateTime.UtcNow,
//                WalletBalance = 0,
//                RoleId = 2
//            },
//            new backend.Models.User
//            {
//                FullName = "Test Customer",
//                Email = "customer@test.com",
//                PhoneNumber = "01000000001",
//                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test@123"),
//                IsActive = true,
//                IsEmailConfirmed = true,
//                CreatedAt = DateTime.UtcNow,
//                WalletBalance = 0,
//                RoleId = 1
//            }
//        };

//        context.Users.AddRange(users);
//        context.SaveChanges();
//        Console.WriteLine("✅ Test users seeded!");
//    }
//}

//app.Run();

using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Repositories.Interfaces;
using backend.Repositories.Implementations;
using backend.Services;
using backend.Helpers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using backend.Models;

var builder = WebApplication.CreateBuilder(args);

// =========================================================
// Controllers + JSON options
// =========================================================
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler =
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition =
            System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// =========================================================
// Database
// =========================================================
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// =========================================================
// ✅ Repositories
// =========================================================
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICartRepository, CartRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IWishlistRepository, WishlistRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<IAddressRepository, AddressRepository>();
builder.Services.AddScoped<IPromoCodeRepository, PromoCodeRepository>();
builder.Services.AddScoped<IPaymentRepository, PaymentRepository>();
builder.Services.AddScoped<IBannerRepository, BannerRepository>();

// =========================================================
// ✅ Services
// =========================================================
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<ProductService>();
builder.Services.AddScoped<CartService>();
builder.Services.AddScoped<OrderService>();
builder.Services.AddScoped<PaymentService>();
builder.Services.AddScoped<CategoryService>();
builder.Services.AddScoped<WishlistService>();
builder.Services.AddScoped<ReviewService>();
builder.Services.AddScoped<BannerService>();

// =========================================================
// ✅ Helpers
// =========================================================
builder.Services.AddSingleton<JwtHelper>();
builder.Services.AddSingleton<EmailHelper>();

// =========================================================
// ✅ Authentication (JWT)
// =========================================================
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

// =========================================================
// ✅ CORS — single permissive policy.
// For deployment we don't know in advance which URL Vercel will assign,
// so allow any origin. If you want to lock it down later, replace
// SetIsOriginAllowed with WithOrigins("https://your-app.vercel.app").
// =========================================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.SetIsOriginAllowed(_ => true)
              .AllowAnyMethod()
              .AllowAnyHeader();
        // No .AllowCredentials() — combining wildcard origin with credentials
        // is rejected by browsers. The auth token rides in the Authorization
        // header which doesn't need credentials mode.
    });
});

var app = builder.Build();

// =========================================================
// Middleware
// =========================================================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Render terminates HTTPS at the edge and forwards as HTTP, so calling
// UseHttpsRedirection() in production causes a redirect loop. We only
// enforce it locally.


if (app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}



app.UseStaticFiles();

// CORS must come BEFORE authentication / authorization so preflight
// OPTIONS requests get the right headers.
app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// =========================================================
// ✅ Auto-apply migrations + seed roles + seed test users
// On first startup the deployed DB is empty, so we run migrations
// then ensure the three test users exist.
// =========================================================
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();

        // Apply any pending migrations so the deployed DB schema is in sync.
        // Wrapped in try/catch so a transient DB connection failure on first
        // boot doesn't crash the whole app — Render will retry the request.
        context.Database.Migrate();

        // Seed roles first so the FK on Users doesn't fail.
        if (!context.Roles.Any())
        {
            context.Roles.AddRange(
                new Role { Id = 1, Name = "Customer", Description = "Regular customer" },
                new Role { Id = 2, Name = "Seller", Description = "Seller account" },
                new Role { Id = 3, Name = "Admin", Description = "Administrator" }
            );
            context.SaveChanges();
            Console.WriteLine("✅ Roles seeded!");
        }

        // Seed test users only if the admin account doesn't already exist.
        if (!context.Users.Any(u => u.Email == "admin@test.com"))
        {
            var users = new[]
            {
                new User
                {
                    FullName = "Test Admin",
                    Email = "admin@test.com",
                    PhoneNumber = "01000000003",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test@123"),
                    IsActive = true,
                    IsEmailConfirmed = true,
                    CreatedAt = DateTime.UtcNow,
                    WalletBalance = 0,
                    RoleId = 3
                },
                new User
                {
                    FullName = "Test Seller",
                    Email = "seller@test.com",
                    PhoneNumber = "01000000002",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test@123"),
                    IsActive = true,
                    IsEmailConfirmed = true,
                    CreatedAt = DateTime.UtcNow,
                    WalletBalance = 0,
                    RoleId = 2
                },
                new User
                {
                    FullName = "Test Customer",
                    Email = "customer@test.com",
                    PhoneNumber = "01000000001",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test@123"),
                    IsActive = true,
                    IsEmailConfirmed = true,
                    CreatedAt = DateTime.UtcNow,
                    WalletBalance = 0,
                    RoleId = 1
                }
            };

            context.Users.AddRange(users);
            context.SaveChanges();
            Console.WriteLine("✅ Test users seeded!");
        }
    }
    catch (Exception ex)
    {
        // Log but don't crash — the app can still serve requests that don't
        // touch the DB, and the next restart will retry.
        Console.WriteLine($"⚠️ Startup DB init failed: {ex.Message}");
    }
}

app.Run();