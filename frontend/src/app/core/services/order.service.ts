import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, CreateOrderDto, TrackingInfo } from '../models/order.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  // Real backend endpoints:
  // POST   /api/Orders
  // GET    /api/Orders        (admin: all orders)
  // GET    /api/Orders/{id}
  // PUT    /api/Orders/{id}/cancel
  // GET    /api/Orders/{id}/track
  private readonly API = `${environment.apiUrl}/api/Orders`;
  private http = inject(HttpClient);

  // POST /api/Orders
  createOrder(dto: CreateOrderDto): Observable<Order> {
    return this.http.post<Order>(this.API, dto);
  }

  // GET /api/Orders/{id}
  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.API}/${id}`);
  }

  // GET /api/Orders  (for logged-in user, backend filters by userId from token)
  getUserOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.API);
  }

  // PUT /api/Orders/{id}/cancel
  cancelOrder(id: number): Observable<any> {
    return this.http.put(`${this.API}/${id}/cancel`, {});
  }

  // GET /api/Orders/{id}/track
  trackOrder(id: number): Observable<TrackingInfo> {
    return this.http.get<TrackingInfo>(`${this.API}/${id}/track`);
  }



  createGuestOrder(data: {
  email: string;
  fullName: string;
  phoneNumber: string;
  street: string;
  city: string;
  state?: string;
  zipCode?: string;
  country: string;
  paymentMethod: string;
  notes?: string;
  items: Array<{ productId: number; quantity: number }>;
}): Observable<{ orderNumber: string; totalAmount: number; status: string }> {
  return this.http.post<any>(`${this.API}/Orders/guest`, data);
}
}
