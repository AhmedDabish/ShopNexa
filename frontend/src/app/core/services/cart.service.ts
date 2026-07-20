import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  // Real backend: GET/POST/PUT/DELETE /api/Cart
  private readonly API = `${environment.apiUrl}/api/Cart`;
  private http = inject(HttpClient);

  private _cart$ = new BehaviorSubject<Cart | null>(null);
  cart$ = this._cart$.asObservable();

  get cartCount(): number {
    return this._cart$.value?.cartItems?.reduce((s, i) => s + i.quantity, 0) ?? 0;
  }

  get cartTotal(): number {
    return this._cart$.value?.cartItems?.reduce((s, i) => {
      const price = i.product?.discountPrice ?? i.product?.price ?? i.priceAtAdd;
      return s + price * i.quantity;
    }, 0) ?? 0;
  }

  get cartItems(): CartItem[] {
    return this._cart$.value?.cartItems ?? [];
  }

  // GET /api/Cart
  loadCart(): Observable<Cart> {
    return this.http.get<Cart>(this.API).pipe(tap(cart => this._cart$.next(cart)));
  }

  // POST /api/Cart/items  body: { productId, quantity }
  addItem(productId: number, quantity: number = 1): Observable<Cart> {
    return this.http.post<Cart>(`${this.API}/items`, { productId, quantity }).pipe(
      tap(c => this._cart$.next(c))
    );
  }

  // PUT /api/Cart/items/{id}  body: { quantity }
  updateItem(itemId: number, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.API}/items/${itemId}`, { quantity }).pipe(
      tap(c => this._cart$.next(c))
    );
  }

  // DELETE /api/Cart/items/{id}
  removeItem(itemId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.API}/items/${itemId}`).pipe(
      tap(c => this._cart$.next(c))
    );
  }

  // DELETE /api/Cart/clear
  clear(): Observable<any> {
    return this.http.delete(`${this.API}/clear`).pipe(
      tap(() => this._cart$.next(null))
    );
  }


  clearState(): void {
  this._cart$.next(null);
}
}
