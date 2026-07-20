import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Product } from '../../../../core/models/product.model';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';

@Component({ selector: 'app-admin-product-list', standalone: true, imports: [CommonModule, RouterLink, CurrencyFormatPipe], templateUrl: './product-list.html', styleUrl: './product-list.css' })
export class AdminProductListComponent implements OnInit {
  private svc = inject(ProductService);
  private notify = inject(NotificationService);
  products: Product[] = [];
  loading = true;

  ngOnInit(): void { this.svc.getProducts({ limit: 50 }).subscribe({ next: r => { this.products = r.items; this.loading = false; }, error: () => { this.loading = false; } }); }

  delete(id: number): void {
    if (!confirm('Confirm product deletion?')) return;
    this.svc.deleteProduct(id).subscribe({ next: () => { this.products = this.products.filter(p => p.id !== id); this.notify.success('Product deleted'); } });
  }
}
