import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerService } from '../../../core/services/seller.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';

@Component({ selector: 'app-seller-orders', standalone: true, imports: [CommonModule, CurrencyFormatPipe, DateFormatPipe], templateUrl: './orders.html', styleUrl: './orders.css' })
export class SellerOrdersComponent implements OnInit {
  private sellerSvc = inject(SellerService);
  orders: any[] = [];
  loading = true;
  ngOnInit(): void { this.sellerSvc.getOrders().subscribe({ next: o => { this.orders = o; this.loading = false; }, error: () => { this.loading = false; } }); }
}
