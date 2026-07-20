import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SellerService } from '../../../core/services/seller.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({ selector: 'app-my-products', standalone: true, imports: [CommonModule, RouterLink, CurrencyFormatPipe], templateUrl: './my-products.html', styleUrl: './my-products.css' })
export class MyProductsComponent implements OnInit {
  private sellerSvc = inject(SellerService);
  products: any[] = [];
  loading = true;
  ngOnInit(): void { this.sellerSvc.getProducts().subscribe({ next: p => { this.products = p; this.loading = false; }, error: () => { this.loading = false; } }); }
}
