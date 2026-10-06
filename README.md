# Ecommerce Platform (Angular + ASP.NET Core)
<img width="1919" height="839" alt="image" src="https://github.com/user-attachments/assets/471cbff4-d9ca-4c61-87c1-d1e2ec079054" />
<img width="1919" height="850" alt="image" src="https://github.com/user-attachments/assets/9db84cb4-6320-44dc-bb3e-8fc7920148d8" />
<img width="1912" height="879" alt="image" src="https://github.com/user-attachments/assets/701eff43-f99d-459b-b35b-d82e314e1b6c" />
<img width="1900" height="842" alt="image" src="https://github.com/user-attachments/assets/d2b381db-7107-4421-a639-42b110579977" />
<img width="1919" height="522" alt="image" src="https://github.com/user-attachments/assets/6765eb12-1aa9-490c-957f-37cdb7d2007e" />


A full-stack e-commerce web application featuring separate experiences for **Customers**, **Sellers**, and **Admins** — built with an Angular frontend and an ASP.NET Core Web API backend.

**Live Demo:** https://ecommerce129angular.runasp.net/
**API / Swagger:** https://ecommerce129.runasp.net/swagger/index.html

## Demo Accounts

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin@test.com` | `1835617102030Aa` |
| Seller | `seller@gmail.com` | `123456789Aa` |
| Customer | `customer@gmail.com` | `123456789Aa` |

## Tech Stack

**Frontend**
- Angular 21 (standalone components, Angular CLI)
- TypeScript
- Zone.js
- Vitest (unit testing)
- CSS / SCSS
- RxJS (reactive services/state)
- Route Guards: Admin, Auth, Seller
- HTTP Interceptors: Auth, Error handling, Loading state
- Reactive & Template-driven Forms
- Angular Router (feature-based routing)

**Backend**
- ASP.NET Core 8 Web API
- C# / .NET 8 SDK
- Entity Framework Core 8
- EF Core Tools & `dotnet-ef` CLI (v10)
- SQL Server (relational database)
- JWT Bearer Authentication (`Microsoft.AspNetCore.Authentication.JwtBearer`)
- Google.Apis.Auth (Google OAuth login)
- Stripe.net (payment processing)
- BCrypt.Net-Next (password hashing)
- Swashbuckle / Swagger (API documentation & testing UI)
- Repository Pattern + Service Layer architecture
- SMTP Email service (email confirmation, password reset)

**Database**
- Microsoft SQL Server
- Code-First migrations via EF Core

**DevOps / Tooling**
- npm (package management)
- Angular CLI (build, serve, scaffolding)
- Git & GitHub (version control)
- Hosted on somee.com (backend) & runasp.net (frontend/API)
- Swagger UI (API testing/documentation)

**Third-Party Integrations**
- Stripe (payments)
- Google OAuth (social login)
- SMTP / Gmail (transactional emails)

## Features

- **Authentication:** Register, login, email confirmation, forgot/reset password, Google sign-in, JWT-based auth
- **Catalog:** Products, categories, product images, reviews
- **Shopping:** Cart, wishlist, checkout, promo codes, order summary
- **Payments:** Stripe integration
- **Orders:** Order placement, order history, order details
- **Admin Dashboard:** Manage users, products, categories, orders, banners, promo codes, and footer content
- **Seller Dashboard:** Seller-specific product and order management
- **Notifications & theming:** In-app notifications and theme service

## Project Structure

```
├── src/app/
│   ├── core/
│   │   ├── guards/          # admin, auth, seller route guards
│   │   ├── interceptors/    # auth, error, loading interceptors
│   │   ├── models/          # cart, order, product, user models
│   │   └── services/        # API service layer
│   └── features/
│       ├── admin/           # admin dashboard, banners, categories, orders, products, promo codes, users
│       ├── auth/            # login, register, confirm email, forgot/reset password
│       ├── cart/
│       └── checkout/        # order summary, payment method, promo code
│
├── Controllers/              # Auth, Products, Categories, Cart, Orders, Payment, Reviews, Seller, Users, Wishlist, etc.
├── Models/                   # EF Core entity models
├── Services/                 # Business logic layer
├── Repositories/             # Data access layer
└── Program.cs                # API entry point / configuration
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) & npm
- [Angular CLI](https://angular.dev/tools/cli)
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- SQL Server

### Backend Setup

1. Configure your `appsettings.json` with your own values for:
   - `ConnectionStrings:DefaultConnection`
   - `Jwt:Key`, `Jwt:Issuer`, `Jwt:Audience`
   - `Email` (SMTP settings)
   - `Google:ClientId` / `Google:ClientSecret`
2. Apply EF Core migrations:
   ```bash
   dotnet ef database update
   ```
3. Run the API:
   ```bash
   dotnet run
   ```
4. Swagger UI will be available at `/swagger`.

### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   ng serve
   ```
3. Navigate to `http://localhost:4200/`.

### Build

```bash
ng build
```

Build artifacts are output to the `dist/` directory.

## Testing

```bash
ng test   # unit tests (Vitest)
ng e2e    # end-to-end tests
```

## License

This project is for portfolio/demo purposes.
