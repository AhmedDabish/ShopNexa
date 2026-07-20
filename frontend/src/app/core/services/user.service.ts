import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, Address } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  // Real backend:
  // GET  /api/Users/profile
  // PUT  /api/Users/profile
  // PUT  /api/Users/change-password
  // GET  /api/Users/addresses
  // POST /api/Users/addresses
  // PUT  /api/Users/addresses/{id}
  // DELETE /api/Users/addresses/{id}
  // GET  /api/Users/wallet
  private readonly API = `${environment.apiUrl}/api/Users`;
  private http = inject(HttpClient);

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.API}/profile`);
  }

  updateProfile(data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.API}/profile`, data);
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.put(`${this.API}/change-password`, { oldPassword, newPassword });
  }

  getAddresses(): Observable<Address[]> {
    return this.http.get<Address[]>(`${this.API}/addresses`);
  }

  addAddress(address: Partial<Address>): Observable<Address> {
    return this.http.post<Address>(`${this.API}/addresses`, address);
  }

  updateAddress(id: number, address: Partial<Address>): Observable<Address> {
    return this.http.put<Address>(`${this.API}/addresses/${id}`, address);
  }

  deleteAddress(id: number): Observable<any> {
    return this.http.delete(`${this.API}/addresses/${id}`);
  }

  getWallet(): Observable<{ balance: number; transactions: any[] }> {
    return this.http.get<any>(`${this.API}/wallet`);
  }


  // Uploads a profile picture. The backend returns the new relative URL
// which we propagate to the auth-cached user so the header avatar
// updates instantly without a refresh.
uploadProfileImage(file: File): Observable<{ profileImage: string }> {
  const form = new FormData();
  form.append('file', file);
  return this.http.post<{ profileImage: string }>(
    `${environment.apiUrl}/api/Users/profile/image`,
    form
  );
}

removeProfileImage(): Observable<void> {
  return this.http.delete<void>(`${environment.apiUrl}/api/Users/profile/image`);
}
}
