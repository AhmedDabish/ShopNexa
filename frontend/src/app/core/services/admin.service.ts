import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Order, OrderStatus, Banner, PromoCode } from '../models/order.model';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  pendingOrders: number;
  averageOrderValue?: number;
  topProduct?: { name: string; quantitySold: number };
}

@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly BASE = `${environment.apiUrl}/api`;
  private http = inject(HttpClient);

  // ─────────────────────────  Dashboard  ─────────────────────────

  getDashboard(): Observable<any> {
    return this.http.get(`${this.BASE}/Admin/dashboard`);
  }

  // Monthly revenue + orders for the line chart. Asks the backend for
  // the last N months and fills missing months server-side so the chart
  // axis stays uniform.
  getMonthlySalesStats(months: number = 6): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE}/Admin/monthly-sales-stats?months=${months}`);
  }

  // Orders grouped by status — feeds the pie chart.
  getOrderStatusStats(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE}/Admin/order-status-stats`);
  }

  // Top sellers by units. The backend parameter is named `count`, not `top`.
  getTopProducts(top: number = 5): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE}/Admin/top-products?count=${top}`);
  }

  // ─────────────────────────  Users  ─────────────────────────

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.BASE}/Admin/users`);
  }

  approveUser(id: number): Observable<any> {
    return this.http.put(`${this.BASE}/Admin/users/${id}/approve`, {});
  }

  restrictUser(id: number): Observable<any> {
    return this.http.put(`${this.BASE}/Admin/users/${id}/restrict`, {});
  }

  // ─────────────────────────  Orders  ─────────────────────────

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.BASE}/Admin/orders`);
  }

  updateOrderStatus(id: number, status: OrderStatus): Observable<any> {
    return this.http.put(`${this.BASE}/Admin/orders/${id}/status`, { status });
  }

  // ─────────────────────────  Banners  ─────────────────────────

  getBanners(): Observable<Banner[]> {
    return this.http.get<Banner[]>(`${this.BASE}/Banners`);
  }

  getAllBanners(): Observable<Banner[]> {
    return this.http.get<Banner[]>(`${this.BASE}/Banners/all`);
  }

  getBanner(id: number): Observable<Banner> {
    return this.http.get<Banner>(`${this.BASE}/Banners/${id}`);
  }

  createBanner(data: Partial<Banner>): Observable<Banner> {
    return this.http.post<Banner>(`${this.BASE}/Banners`, data);
  }

  updateBanner(id: number, data: Partial<Banner>): Observable<Banner> {
    return this.http.put<Banner>(`${this.BASE}/Banners/${id}`, data);
  }

  deleteBanner(id: number): Observable<any> {
    return this.http.delete(`${this.BASE}/Banners/${id}`);
  }

  // ─────────────────────────  Promo Codes  ─────────────────────────

  getPromoCodes(): Observable<PromoCode[]> {
    return this.http.get<PromoCode[]>(`${this.BASE}/PromoCode`);
  }

  createPromoCode(data: Partial<PromoCode>): Observable<PromoCode> {
    return this.http.post<PromoCode>(`${this.BASE}/PromoCode`, data);
  }

  updatePromoCode(id: number, data: Partial<PromoCode>): Observable<PromoCode> {
    return this.http.put<PromoCode>(`${this.BASE}/PromoCode/${id}`, data);
  }

  deletePromoCode(id: number): Observable<any> {
    return this.http.delete(`${this.BASE}/PromoCode/${id}`);
  }
}