// import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User, LoginDto, RegisterDto, AuthResponse } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { Injectable, inject, Injector } from '@angular/core';  // أضف Injector
import { CartService } from './cart.service';                   // imports جديدة
import { WishlistService } from './wishlist.service';
@Injectable({ providedIn: 'root' })
export class AuthService {
  // Real backend: POST /api/Auth/register  POST /api/Auth/login
  private readonly API = `${environment.apiUrl}/api/Auth`;
  private http = inject(HttpClient);
  private router = inject(Router);
private injector = inject(Injector);
  private _currentUser$ = new BehaviorSubject<User | null>(this.getUserFromStorage());
  currentUser$ = this._currentUser$.asObservable();

  get currentUser(): User | null { return this._currentUser$.value; }
  get isLoggedIn(): boolean { return !!this.getToken(); }
  get role(): string | null { return this.currentUser?.role?.name ?? null; }
  get isAdmin(): boolean { return this.role === 'Admin'; }
  get isSeller(): boolean { return this.role === 'Seller' || this.role === 'Admin'; }
  get isCustomer(): boolean { return this.role === 'Customer'; }

login(dto: LoginDto): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.API}/login`, dto).pipe(
    tap(res => {
      this.saveSession(res);
      this.refreshUserState();  // ← السطر الجديد
    })
  );
}
  register(dto: RegisterDto): Observable<any> {
    return this.http.post(`${this.API}/register`, dto);
  }

  // These endpoints may not be in real backend, kept for compatibility
  confirmEmail(token: string): Observable<any> {
  return this.http.post(`${this.API}/confirm-email`, { token });
}

forgotPassword(email: string): Observable<any> {
  return this.http.post(`${this.API}/forgot-password`, { email });
}

resetPassword(token: string, newPassword: string): Observable<any> {
  return this.http.post(`${this.API}/reset-password`, { token, newPassword });
}

  logout(): void {
  this.clearUserState();   // ← السطر الجديد، قبل clearSession
  this.clearSession();
  this.router.navigate(['/auth/login']);
}

  getToken(): string | null { return localStorage.getItem('token'); }

  private saveSession(res: AuthResponse): void {
    localStorage.setItem('token', res.token);
    if (res.refreshToken) localStorage.setItem('refreshToken', res.refreshToken);
    localStorage.setItem('user', JSON.stringify(res.user));
    this._currentUser$.next(res.user);
  }

  private clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this._currentUser$.next(null);
  }

  private getUserFromStorage(): User | null {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  }

  private setCurrentUser(user: User | null): void {
    this._currentUser$.next(user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  private clearUserState(): void {
  try { this.injector.get(CartService).clearState(); } catch { /* */ }
  try { this.injector.get(WishlistService).clearState(); } catch { /* */ }
}

private refreshUserState(): void {
  this.clearUserState();
  try { this.injector.get(CartService).loadCart().subscribe({ error: () => {} }); } catch { /* */ }
  try { this.injector.get(WishlistService).load().subscribe({ error: () => {} }); } catch { /* */ }
}


// Called after a successful profile-image upload. Updates both the
// in-memory currentUser and localStorage so the header/profile pages
// see the new URL immediately.
updateProfileImage(newPath: string): void {
  const current = this.currentUser;
  if (!current) return;

  const updated = { ...current, profileImage: newPath };
  this.setCurrentUser(updated);  // or however your service stores it
  try {
    localStorage.setItem('currentUser', JSON.stringify(updated));
  } catch { /* private mode */ }
}

googleLogin(idToken: string): Observable<AuthResponse> {
  return this.http.post<AuthResponse>(`${this.API}/google-login`, { idToken }).pipe(
    tap(res => {
      this.saveSession(res);
      this.refreshUserState();
    })
  );
}
}
