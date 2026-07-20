import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  // Real backend: GET /api/Wishlist  POST /api/Wishlist/items  DELETE /api/Wishlist/items/{productId}
  private readonly API = `${environment.apiUrl}/api/Wishlist`;
  private http = inject(HttpClient);

  private _items$ = new BehaviorSubject<any[]>([]);
  items$ = this._items$.asObservable();

  get count(): number { return this._items$.value.length; }

  isInWishlist(productId: number): boolean {
    return this._items$.value.some(i => i.productId === productId);
  }

  // GET /api/Wishlist
  load(): Observable<any> {
    return this.http.get<any>(this.API).pipe(
      tap(w => this._items$.next(w?.items ?? []))
    );
  }

  // POST /api/Wishlist/items  body: { productId }
  add(productId: number): Observable<any> {
    return this.http.post<any>(`${this.API}/items`, { productId }).pipe(
      tap(item => this._items$.next([...this._items$.value, { ...item, productId }]))
    );
  }

  // DELETE /api/Wishlist/items/{productId}  ← uses productId not itemId!
  remove(productId: number): Observable<any> {
    return this.http.delete(`${this.API}/items/${productId}`).pipe(
      tap(() => this._items$.next(this._items$.value.filter(i => i.productId !== productId)))
    );
  }

  toggle(productId: number): Observable<any> {
    if (this.isInWishlist(productId)) {
      return this.remove(productId);
    }
    return this.add(productId);
  }
  clearState(): void {
  this._items$.next([]);
}
}
