import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-seller-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="seller-wrap">
      <aside class="seller-sidebar">
        <h3 class="sidebar-title">🏪 Seller Panel</h3>
        <a routerLink="/seller" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="side-link">📊 Dashboard</a>
        <a routerLink="/seller/products" routerLinkActive="active" class="side-link">🏷️ My Products</a>
        <a routerLink="/seller/orders" routerLinkActive="active" class="side-link">📦 Orders</a>
        <a routerLink="/seller/earnings" routerLinkActive="active" class="side-link">💰 Earnings</a>
      </aside>
      <main class="seller-content"><router-outlet /></main>
    </div>
  `,
  styles: [`
    .seller-wrap{display:grid;grid-template-columns:200px 1fr;min-height:calc(100vh - 110px)}
    .seller-sidebar{background:#fff;border-right:1px solid #e5e7eb;padding:20px 12px;position:sticky;top:110px;height:fit-content}
    .sidebar-title{font-size:13px;font-weight:700;color:#374151;margin-bottom:14px;padding-bottom:10px;border-bottom:1px solid #f3f4f6}
    .side-link{display:block;padding:10px 14px;font-size:13px;color:#4b5563;text-decoration:none;border-radius:8px;margin-bottom:4px}
    .side-link:hover{background:#f9fafb;color:#111827}
    .side-link.active{background:#eff6ff;color:#2563eb;font-weight:600}
    .seller-content{padding:28px;background:#f9fafb}
    @media(max-width:768px){.seller-wrap{grid-template-columns:1fr}.seller-sidebar{display:none}}
  `]
})
export class SellerLayoutComponent {}
