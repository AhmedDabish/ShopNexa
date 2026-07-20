import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="admin-wrap">
      <aside class="admin-sidebar">
        <h3 class="sidebar-title">⚙️ Admin Panel</h3>
        <a routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="side-link">📊 Dashboard</a>
        <a routerLink="/admin/users" routerLinkActive="active" class="side-link">👥 Users</a>
        <a routerLink="/admin/products" routerLinkActive="active" class="side-link">🏷️ Products</a>
        <a routerLink="/admin/categories" routerLinkActive="active" class="side-link">📂 Categories</a>
        <a routerLink="/admin/orders" routerLinkActive="active" class="side-link">📦 Orders</a>
        <a routerLink="/admin/promo-codes" routerLinkActive="active" class="side-link">🎫 Promo Codes</a>
        <a routerLink="/admin/banners" routerLinkActive="active" class="side-link">🖼️ Banners</a>
        <a routerLink="/admin/footer" routerLinkActive="active" class="side-link">📋 Footer</a>

        </aside>
      <main class="admin-content"><router-outlet /></main>
    </div>
  `,
  styles: [`
    .admin-wrap{display:grid;grid-template-columns:220px 1fr;min-height:calc(100vh - 110px)}
    .admin-sidebar{background:#fff;border-right:1px solid #e5e7eb;padding:20px 12px;position:sticky;top:110px;height:fit-content}
    .sidebar-title{font-size:13px;font-weight:700;color:#374151;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid #f3f4f6}
    .side-link{display:block;padding:10px 14px;font-size:13px;color:#4b5563;text-decoration:none;border-radius:8px;margin-bottom:4px}
    .side-link:hover{background:#f9fafb;color:#111827}
    .side-link.active{background:#eff6ff;color:#2563eb;font-weight:600}
    .admin-content{padding:28px;background:#f9fafb}
    @media(max-width:768px){.admin-wrap{grid-template-columns:1fr}.admin-sidebar{display:none}}
  `]
})
export class AdminLayoutComponent {}
