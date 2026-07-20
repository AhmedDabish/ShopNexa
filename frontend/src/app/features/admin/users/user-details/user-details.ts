import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../core/models/user.model';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';

@Component({ selector: 'app-user-details', standalone: true, imports: [CommonModule, RouterLink, DateFormatPipe, CurrencyFormatPipe], template: `
  <div>
    <a routerLink="/admin/users" class="back">← Users list</a>
    @if (loading) { <p>Loading…</p> }
    @else if (user) {
      <h2>{{ user.fullName }}</h2>
      <p>Email: {{ user.email }}</p>
      <p>Phone: {{ user.phoneNumber }}</p>
      <p>Role: {{ user.role?.name }}</p>
      <p>Wallet balance: {{ user.walletBalance | currencyFormat }}</p>
      <p>Registration date: {{ user.createdAt | dateFormat:'long' }}</p>
    }
  </div>
`, styles: [`.back{font-size:13px;color:#2563eb;text-decoration:none;display:block;margin-bottom:16px} h2{font-size:20px;font-weight:700;margin-bottom:12px} p{font-size:14px;color:#4b5563;margin-bottom:8px}`] })
export class UserDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private userSvc = inject(UserService);
  user: User | null = null;
  loading = true;
  ngOnInit(): void { this.userSvc.getProfile().subscribe({ next: u => { this.user = u; this.loading = false; }, error: () => { this.loading = false; } }); }
}
