import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SellerService {
  // Real backend:
  // GET /api/Seller/products
  // GET /api/Seller/orders
  // GET /api/Seller/earnings
  private readonly API = `${environment.apiUrl}/api/Seller`;
  private http = inject(HttpClient);

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/products`);
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/orders`);
  }

  getEarnings(): Observable<{ totalEarnings: number; pendingPayouts: number; history: any[] }> {
    return this.http.get<any>(`${this.API}/earnings`);
  }

  requestPayout(): Observable<any> {
    return this.http.post(`${this.API}/payout`, {});
  }
}
