// // import { Routes } from '@angular/router';
// // import { authGuard } from './core/guards/auth.guard';
// // import { adminGuard } from './core/guards/admin.guard';
// // import { sellerGuard } from './core/guards/seller.guard';

// // export const routes: Routes = [
// //   // Default → Login
// //   { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

// //   // Auth
// //   { path: 'auth/login',          loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent) },
// //   { path: 'auth/register',       loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent) },
// //   { path: 'auth/forgot-password',loadComponent: () => import('./features/auth/forgot-password/forgot-password').then(m => m.ForgotPasswordComponent) },
// //   { path: 'auth/reset-password', loadComponent: () => import('./features/auth/reset-password/reset-password').then(m => m.ResetPasswordComponent) },
// //   { path: 'auth/confirm-email',  loadComponent: () => import('./features/auth/confirm-email/confirm-email').then(m => m.ConfirmEmailComponent) },

// //   // Home (protected)
// //   { path: 'home', canActivate: [authGuard], loadComponent: () => import('./features/home/home').then(m => m.HomeComponent) },

// //   // Products (public)
// //   { path: 'products',      loadComponent: () => import('./features/products/product-list/product-list').then(m => m.ProductListComponent) },
// //   { path: 'products/:id',  loadComponent: () => import('./features/products/product-details/product-details').then(m => m.ProductDetailsComponent) },
// //   { path: 'search',        loadComponent: () => import('./features/products/search/search').then(m => m.SearchComponent) },

// //   // Cart (public)
// //   { path: 'cart', loadComponent: () => import('./features/cart/cart').then(m => m.CartComponent) },

// //   // Checkout (protected)
// //   { path: 'checkout', canActivate: [authGuard], loadComponent: () => import('./features/checkout/checkout').then(m => m.CheckoutComponent) },

// //   // Orders (protected)
// //   { path: 'orders',           canActivate: [authGuard], loadComponent: () => import('./features/orders/order-list/order-list').then(m => m.OrderListComponent) },
// //   { path: 'orders/:id',       canActivate: [authGuard], loadComponent: () => import('./features/orders/order-details/order-details').then(m => m.OrderDetailsComponent) },
// //   { path: 'orders/:id/track', canActivate: [authGuard], loadComponent: () => import('./features/orders/order-tracking/order-tracking').then(m => m.OrderTrackingComponent) },

// //   // Profile (protected)
// //   {
// //     path: 'profile',
// //     canActivate: [authGuard],
// //     loadComponent: () => import('./features/profile/profile').then(m => m.ProfileComponent),
// //     children: [
// //       { path: '', redirectTo: 'personal-info', pathMatch: 'full' },
// //       { path: 'personal-info',   loadComponent: () => import('./features/profile/components/personal-info/personal-info').then(m => m.PersonalInfoComponent) },
// //       { path: 'addresses',       loadComponent: () => import('./features/profile/components/addresses/addresses').then(m => m.AddressesComponent) },
// //       { path: 'change-password', loadComponent: () => import('./features/profile/components/change-password/change-password').then(m => m.ChangePasswordComponent) },
// //       { path: 'wallet',          loadComponent: () => import('./features/profile/components/wallet/wallet').then(m => m.WalletComponent) },
// //     ]
// //   },

// //   // Wishlist (protected)
// //   { path: 'wishlist', canActivate: [authGuard], loadComponent: () => import('./features/wishlist/wishlist').then(m => m.WishlistComponent) },

// //   // Admin (protected)
// //   {
// //     path: 'admin',
// //     canActivate: [adminGuard],
// //     loadComponent: () => import('./features/admin/admin-layout').then(m => m.AdminLayoutComponent),
// //     children: [
// //       { path: '',                  loadComponent: () => import('./features/admin/dashboard/dashboard').then(m => m.AdminDashboardComponent) },
// //       { path: 'users',             loadComponent: () => import('./features/admin/users/user-list/user-list').then(m => m.UserListComponent) },
// //       { path: 'users/:id',         loadComponent: () => import('./features/admin/users/user-details/user-details').then(m => m.UserDetailsComponent) },
// //       { path: 'products',          loadComponent: () => import('./features/admin/products/product-list/product-list').then(m => m.AdminProductListComponent) },
// //       { path: 'products/add',      loadComponent: () => import('./features/admin/products/add-product/add-product').then(m => m.AddProductComponent) },
// //       { path: 'products/edit/:id', loadComponent: () => import('./features/admin/products/edit-product/edit-product').then(m => m.EditProductComponent) },
// //       { path: 'categories',        loadComponent: () => import('./features/admin/categories/category-list/category-list').then(m => m.CategoryListComponent) },
// //       { path: 'orders',            loadComponent: () => import('./features/admin/orders/order-list/order-list').then(m => m.AdminOrderListComponent) },
// //       { path: 'orders/:id',        loadComponent: () => import('./features/admin/orders/order-details/order-details').then(m => m.AdminOrderDetailsComponent) },
// //       { path: 'promo-codes',       loadComponent: () => import('./features/admin/promo-codes/promo-list/promo-list').then(m => m.PromoListComponent) },
// //       { path: 'banners',           loadComponent: () => import('./features/admin/banners/banner-list/banner-list').then(m => m.BannerListComponent) },
// //     ]
// //   },

// //   // Seller (protected)
// //   {
// //     path: 'seller',
// //     canActivate: [sellerGuard],
// //     loadComponent: () => import('./features/seller/seller-layout').then(m => m.SellerLayoutComponent),
// //     children: [
// //       { path: '',         loadComponent: () => import('./features/seller/dashboard/dashboard').then(m => m.SellerDashboardComponent) },
// //       { path: 'products', loadComponent: () => import('./features/seller/my-products/my-products').then(m => m.MyProductsComponent) },
// //       { path: 'orders',   loadComponent: () => import('./features/seller/orders/orders').then(m => m.SellerOrdersComponent) },
// //       { path: 'earnings', loadComponent: () => import('./features/seller/earnings/earnings').then(m => m.EarningsComponent) },
// //     ]
// //   },

// //   // Fallback
// //   { path: '**', redirectTo: 'auth/login' }
// // ];


// import { Routes } from '@angular/router';
// import { authGuard } from './core/guards/auth.guard';
// import { adminGuard } from './core/guards/admin.guard';
// import { sellerGuard } from './core/guards/seller.guard';

// export const routes: Routes = [
//   // Default → Login
//   { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

//   // Auth
//   { path: 'auth/login',          loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent) },
//   { path: 'auth/register',       loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent) },
//   { path: 'auth/forgot-password',loadComponent: () => import('./features/auth/forgot-password/forgot-password').then(m => m.ForgotPasswordComponent) },
//   { path: 'auth/reset-password', loadComponent: () => import('./features/auth/reset-password/reset-password').then(m => m.ResetPasswordComponent) },
//   { path: 'auth/confirm-email',  loadComponent: () => import('./features/auth/confirm-email/confirm-email').then(m => m.ConfirmEmailComponent) },

//   // Home (protected)
//   { path: 'home', canActivate: [authGuard], loadComponent: () => import('./features/home/home').then(m => m.HomeComponent) },

//   // Products (public)
//   { path: 'products',      loadComponent: () => import('./features/products/product-list/product-list').then(m => m.ProductListComponent) },
//   { path: 'products/:id',  loadComponent: () => import('./features/products/product-details/product-details').then(m => m.ProductDetailsComponent) },
//   { path: 'search',        loadComponent: () => import('./features/products/search/search').then(m => m.SearchComponent) },

//   // Cart (public)
//   { path: 'cart', loadComponent: () => import('./features/cart/cart').then(m => m.CartComponent) },

//   // Checkout (protected)
//   // { path: 'checkout', canActivate: [authGuard], loadComponent: () => import('./features/checkout/checkout').then(m => m.CheckoutComponent) },
// { path: 'checkout', loadComponent: () => import('./features/checkout/checkout').then(m => m.CheckoutComponent) },
//   // Orders (protected)
//   { path: 'orders',           canActivate: [authGuard], loadComponent: () => import('./features/orders/order-list/order-list').then(m => m.OrderListComponent) },
//   { path: 'orders/:id',       canActivate: [authGuard], loadComponent: () => import('./features/orders/order-details/order-details').then(m => m.OrderDetailsComponent) },
//   { path: 'orders/:id/track', canActivate: [authGuard], loadComponent: () => import('./features/orders/order-tracking/order-tracking').then(m => m.OrderTrackingComponent) },

//   // Profile (protected)
//   {
//     path: 'profile',
//     canActivate: [authGuard],
//     loadComponent: () => import('./features/profile/profile').then(m => m.ProfileComponent),
//     children: [
//       { path: '', redirectTo: 'personal-info', pathMatch: 'full' },
//       { path: 'personal-info',   loadComponent: () => import('./features/profile/components/personal-info/personal-info').then(m => m.PersonalInfoComponent) },
//       { path: 'addresses',       loadComponent: () => import('./features/profile/components/addresses/addresses').then(m => m.AddressesComponent) },
//       { path: 'change-password', loadComponent: () => import('./features/profile/components/change-password/change-password').then(m => m.ChangePasswordComponent) },
//       { path: 'wallet',          loadComponent: () => import('./features/profile/components/wallet/wallet').then(m => m.WalletComponent) },
//     ]
//   },

//   // Wishlist (protected)
//   { path: 'wishlist', canActivate: [authGuard], loadComponent: () => import('./features/wishlist/wishlist').then(m => m.WishlistComponent) },

//   // Admin (protected)
//   {
//     path: 'admin',
//     canActivate: [adminGuard],
//     loadComponent: () => import('./features/admin/admin-layout').then(m => m.AdminLayoutComponent),
//     children: [
//       { path: '',                  loadComponent: () => import('./features/admin/dashboard/dashboard').then(m => m.AdminDashboardComponent) },
//       { path: 'users',             loadComponent: () => import('./features/admin/users/user-list/user-list').then(m => m.UserListComponent) },
//       { path: 'users/:id',         loadComponent: () => import('./features/admin/users/user-details/user-details').then(m => m.UserDetailsComponent) },
//       { path: 'products',          loadComponent: () => import('./features/admin/products/product-list/product-list').then(m => m.AdminProductListComponent) },
//       { path: 'products/add',      loadComponent: () => import('./features/admin/products/add-product/add-product').then(m => m.AddProductComponent) },
//       { path: 'products/edit/:id', loadComponent: () => import('./features/admin/products/edit-product/edit-product').then(m => m.EditProductComponent) },
//       { path: 'categories',        loadComponent: () => import('./features/admin/categories/category-list/category-list').then(m => m.CategoryListComponent) },
//       { path: 'orders',            loadComponent: () => import('./features/admin/orders/order-list/order-list').then(m => m.AdminOrderListComponent) },
//       { path: 'orders/:id',        loadComponent: () => import('./features/admin/orders/order-details/order-details').then(m => m.AdminOrderDetailsComponent) },
//       { path: 'promo-codes',       loadComponent: () => import('./features/admin/promo-codes/promo-list/promo-list').then(m => m.PromoListComponent) },
//       { path: 'banners',           loadComponent: () => import('./features/admin/banners/banner-list/banner-list').then(m => m.BannerListComponent) },
//     ]
//   },

//   // Seller (protected)
//   {
//     path: 'seller',
//     canActivate: [sellerGuard],
//     loadComponent: () => import('./features/seller/seller-layout').then(m => m.SellerLayoutComponent),
//     children: [
//       { path: '',                  loadComponent: () => import('./features/seller/dashboard/dashboard').then(m => m.SellerDashboardComponent) },
//       { path: 'products',          loadComponent: () => import('./features/seller/my-products/my-products').then(m => m.MyProductsComponent) },
//       { path: 'products/add',      loadComponent: () => import('./features/admin/products/add-product/add-product').then(m => m.AddProductComponent) },
//       { path: 'products/edit/:id', loadComponent: () => import('./features/admin/products/edit-product/edit-product').then(m => m.EditProductComponent) },
//       { path: 'orders',            loadComponent: () => import('./features/seller/orders/orders').then(m => m.SellerOrdersComponent) },
//       { path: 'earnings',          loadComponent: () => import('./features/seller/earnings/earnings').then(m => m.EarningsComponent) },
//     ]
//   },

//   // Fallback
//   { path: '**', redirectTo: 'auth/login' }
// ];


import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { sellerGuard } from './core/guards/seller.guard';

export const routes: Routes = [
  // Default → Home (public so guests can browse without logging in).
  // Previously this redirected to /auth/login which made the whole shop
  // gated behind authentication — that defeats guest checkout entirely.
  { path: '', redirectTo: 'home', pathMatch: 'full' },

  // Auth (public)
  { path: 'auth/login',          loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent) },
  { path: 'auth/register',       loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent) },
  { path: 'auth/forgot-password',loadComponent: () => import('./features/auth/forgot-password/forgot-password').then(m => m.ForgotPasswordComponent) },
  { path: 'auth/reset-password', loadComponent: () => import('./features/auth/reset-password/reset-password').then(m => m.ResetPasswordComponent) },
  { path: 'auth/confirm-email',  loadComponent: () => import('./features/auth/confirm-email/confirm-email').then(m => m.ConfirmEmailComponent) },

  // Home — now public so guests can see the storefront landing page.
  { path: 'home', loadComponent: () => import('./features/home/home').then(m => m.HomeComponent) },

  // Products (public)
  { path: 'products',      loadComponent: () => import('./features/products/product-list/product-list').then(m => m.ProductListComponent) },
  { path: 'products/:id',  loadComponent: () => import('./features/products/product-details/product-details').then(m => m.ProductDetailsComponent) },
  { path: 'search',        loadComponent: () => import('./features/products/search/search').then(m => m.SearchComponent) },

  // Cart (public) — anyone can build a cart, logged in or not.
  { path: 'cart', loadComponent: () => import('./features/cart/cart').then(m => m.CartComponent) },

  // Checkout — public now, so guests can place orders too. The component
  // itself decides whether to show the logged-in flow or the guest form.
  { path: 'checkout', loadComponent: () => import('./features/checkout/checkout').then(m => m.CheckoutComponent) },

  // Orders (protected — guests can't see other people's order history)
  { path: 'orders',           canActivate: [authGuard], loadComponent: () => import('./features/orders/order-list/order-list').then(m => m.OrderListComponent) },
  { path: 'orders/:id',       canActivate: [authGuard], loadComponent: () => import('./features/orders/order-details/order-details').then(m => m.OrderDetailsComponent) },
  { path: 'orders/:id/track', canActivate: [authGuard], loadComponent: () => import('./features/orders/order-tracking/order-tracking').then(m => m.OrderTrackingComponent) },

  // Profile (protected)
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile').then(m => m.ProfileComponent),
    children: [
      { path: '', redirectTo: 'personal-info', pathMatch: 'full' },
      { path: 'personal-info',   loadComponent: () => import('./features/profile/components/personal-info/personal-info').then(m => m.PersonalInfoComponent) },
      { path: 'addresses',       loadComponent: () => import('./features/profile/components/addresses/addresses').then(m => m.AddressesComponent) },
      { path: 'change-password', loadComponent: () => import('./features/profile/components/change-password/change-password').then(m => m.ChangePasswordComponent) },
      { path: 'wallet',          loadComponent: () => import('./features/profile/components/wallet/wallet').then(m => m.WalletComponent) },
    ]
  },

  // Wishlist (protected)
  { path: 'wishlist', canActivate: [authGuard], loadComponent: () => import('./features/wishlist/wishlist').then(m => m.WishlistComponent) },

  // Admin (protected)
  // {
  //   path: 'admin',
  //   canActivate: [adminGuard],
  //   loadComponent: () => import('./features/admin/admin-layout').then(m => m.AdminLayoutComponent),
  //   children: [
  //     { path: '',                  loadComponent: () => import('./features/admin/dashboard/dashboard').then(m => m.AdminDashboardComponent) },
  //     { path: 'users',             loadComponent: () => import('./features/admin/users/user-list/user-list').then(m => m.UserListComponent) },
  //     { path: 'users/:id',         loadComponent: () => import('./features/admin/users/user-details/user-details').then(m => m.UserDetailsComponent) },
  //     { path: 'products',          loadComponent: () => import('./features/admin/products/product-list/product-list').then(m => m.AdminProductListComponent) },
  //     { path: 'products/add',      loadComponent: () => import('./features/admin/products/add-product/add-product').then(m => m.AddProductComponent) },
  //     { path: 'products/edit/:id', loadComponent: () => import('./features/admin/products/edit-product/edit-product').then(m => m.EditProductComponent) },
  //     { path: 'categories',        loadComponent: () => import('./features/admin/categories/category-list/category-list').then(m => m.CategoryListComponent) },
  //     { path: 'orders',            loadComponent: () => import('./features/admin/orders/order-list/order-list').then(m => m.AdminOrderListComponent) },
  //     { path: 'orders/:id',        loadComponent: () => import('./features/admin/orders/order-details/order-details').then(m => m.AdminOrderDetailsComponent) },
  //     { path: 'promo-codes',       loadComponent: () => import('./features/admin/promo-codes/promo-list/promo-list').then(m => m.PromoListComponent) },
  //     { path: 'banners',           loadComponent: () => import('./features/admin/banners/banner-list/banner-list').then(m => m.BannerListComponent) },
  //   ]
  // },
// Admin (protected)
{
  path: 'admin',
  canActivate: [adminGuard],
  loadComponent: () => import('./features/admin/admin-layout').then(m => m.AdminLayoutComponent),
  children: [
    { path: '',                  loadComponent: () => import('./features/admin/dashboard/dashboard').then(m => m.AdminDashboardComponent) },
    { path: 'users',             loadComponent: () => import('./features/admin/users/user-list/user-list').then(m => m.UserListComponent) },
    { path: 'users/:id',         loadComponent: () => import('./features/admin/users/user-details/user-details').then(m => m.UserDetailsComponent) },
    { path: 'products',          loadComponent: () => import('./features/admin/products/product-list/product-list').then(m => m.AdminProductListComponent) },
    { path: 'products/add',      loadComponent: () => import('./features/admin/products/add-product/add-product').then(m => m.AddProductComponent) },
    { path: 'products/edit/:id', loadComponent: () => import('./features/admin/products/edit-product/edit-product').then(m => m.EditProductComponent) },
    { path: 'categories',        loadComponent: () => import('./features/admin/categories/category-list/category-list').then(m => m.CategoryListComponent) },
    { path: 'orders',            loadComponent: () => import('./features/admin/orders/order-list/order-list').then(m => m.AdminOrderListComponent) },
    { path: 'orders/:id',        loadComponent: () => import('./features/admin/orders/order-details/order-details').then(m => m.AdminOrderDetailsComponent) },
    { path: 'promo-codes',       loadComponent: () => import('./features/admin/promo-codes/promo-list/promo-list').then(m => m.PromoListComponent) },
    { path: 'banners',           loadComponent: () => import('./features/admin/banners/banner-list/banner-list').then(m => m.BannerListComponent) },
    { path: 'footer',            loadComponent: () => import('./features/admin/footer-content/footer-content').then(m => m.FooterContentComponent) }, // <-- أضف هذا السطر
  ]
},
  // Seller (protected)
  {
    path: 'seller',
    canActivate: [sellerGuard],
    loadComponent: () => import('./features/seller/seller-layout').then(m => m.SellerLayoutComponent),
    children: [
      { path: '',                  loadComponent: () => import('./features/seller/dashboard/dashboard').then(m => m.SellerDashboardComponent) },
      { path: 'products',          loadComponent: () => import('./features/seller/my-products/my-products').then(m => m.MyProductsComponent) },
      { path: 'products/add',      loadComponent: () => import('./features/admin/products/add-product/add-product').then(m => m.AddProductComponent) },
      { path: 'products/edit/:id', loadComponent: () => import('./features/admin/products/edit-product/edit-product').then(m => m.EditProductComponent) },
      { path: 'orders',            loadComponent: () => import('./features/seller/orders/orders').then(m => m.SellerOrdersComponent) },
      { path: 'earnings',          loadComponent: () => import('./features/seller/earnings/earnings').then(m => m.EarningsComponent) },
    { path: 'footer', loadComponent: () => import('./features/admin/footer-content/footer-content').then(m => m.FooterContentComponent) },
    ]
  },

  // Fallback — send to home, not login. The user might just have a stale link.
  { path: '**', redirectTo: 'home' }
];