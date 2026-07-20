import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product } from '../../../core/models/product.model';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';

@Component({ selector: 'app-search', standalone: true, imports: [CommonModule, ProductCardComponent, PaginationComponent], templateUrl: './search.html', styleUrl: './search.css' })
export class SearchComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private svc = inject(ProductService);
  query = ''; products: Product[] = []; totalItems = 0; totalPages = 1; currentPage = 1; loading = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(p => { this.query = p['q'] ?? ''; if (this.query) this.load(1); });
  }

  load(page: number): void {
    this.loading = true;
    this.svc.search(this.query, { page, limit: 12 }).subscribe({ next: r => { this.products = r.items; this.totalItems = r.totalItems; this.totalPages = r.totalPages; this.currentPage = r.currentPage; this.loading = false; }, error: () => { this.loading = false; } });
  }
}
