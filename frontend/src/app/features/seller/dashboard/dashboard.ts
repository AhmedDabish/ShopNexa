import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerService } from '../../../core/services/seller.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({ selector: 'app-seller-dashboard', standalone: true, imports: [CommonModule, CurrencyFormatPipe], templateUrl: './dashboard.html', styleUrl: './dashboard.css' })
export class SellerDashboardComponent implements OnInit {
  private sellerSvc = inject(SellerService);
  earnings: any = null;
  productsCount = 0;
  ordersCount = 0;
  loading = true;

  ngOnInit(): void {
    this.sellerSvc.getEarnings().subscribe({
      next: e => { this.earnings = e; this.loading = false; },
      error: () => { this.earnings = { totalEarnings: 0, pendingPayouts: 0 }; this.loading = false; }
    });
    this.sellerSvc.getProducts().subscribe({
      next: p => this.productsCount = p?.length ?? 0,
      error: () => this.productsCount = 0
    });
    this.sellerSvc.getOrders().subscribe({
      next: o => this.ordersCount = o?.length ?? 0,
      error: () => this.ordersCount = 0
    });
  }
}