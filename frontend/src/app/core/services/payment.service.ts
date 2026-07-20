import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  // Real backend:
  // POST /api/Payment/process
  // GET  /api/Payment/methods
  // POST /api/PromoCode/validate
  private readonly API = `${environment.apiUrl}/api`;
  private http = inject(HttpClient);

  // POST /api/Payment/process
  processPayment(data: { orderId: number; method: string; token?: string }): Observable<any> {
    return this.http.post(`${this.API}/Payment/process`, data);
  }

  // GET /api/Payment/methods
  getPaymentMethods(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API}/Payment/methods`);
  }

  // POST /api/PromoCode/validate
  validatePromoCode(code: string, orderAmount: number): Observable<{ valid: boolean; discount: number; message?: string }> {
    return this.http.post<any>(`${this.API}/PromoCode/validate`, { code, orderAmount });
  }
}
