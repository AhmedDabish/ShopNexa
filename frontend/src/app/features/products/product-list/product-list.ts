import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { Product, Category, ProductFilter } from '../../../core/models/product.model';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card';
import { PaginationComponent } from '../../../shared/components/pagination/pagination';
import { FiltersComponent } from './components/filters/filters';
import { SortComponent } from './components/sort/sort';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent, PaginationComponent, FiltersComponent, SortComponent],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductListComponent implements OnInit {
  private productSvc = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  products: Product[] = [];
  categories: Category[] = [];
  totalItems = 0;
  totalPages = 1;
  currentPage = 1;
  loading = true;
  filter: ProductFilter = { page: 1, limit: 12 };
  showFilters = false;

  ngOnInit(): void {
    this.productSvc.getCategories().subscribe(cats => this.categories = cats);
    // queryParams is a stream — every time the URL changes (filter apply,
    // pagination, sort, reset) we rebuild this.filter from the URL and re-fetch.
    // Keeping the URL as the source of truth means refresh / share-link works.
    this.route.queryParams.subscribe(params => {
      this.filter = {
        page: +params['page'] || 1,
        limit: 12,
        categoryId: params['categoryId'] ? +params['categoryId'] : undefined,
        minPrice:   params['minPrice']   != null ? +params['minPrice']   : undefined,
        maxPrice:   params['maxPrice']   != null ? +params['maxPrice']   : undefined,
        sort:       params['sort'] || undefined,
        rating:     params['rating']     ? +params['rating']     : undefined
      };
      this.currentPage = this.filter.page ?? 1;
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.productSvc.getProducts(this.filter).subscribe({
      next: (res) => {
        this.products = res.items;
        this.totalItems = res.totalItems;
        this.totalPages = res.totalPages;
        this.currentPage = res.currentPage;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  onFilterChange(f: Partial<ProductFilter>): void {
    // Merge then reset to page 1 — applying a new filter from page 5 shouldn't
    // leave the user looking at "page 5 of a different result set".
    this.filter = { ...this.filter, ...f, page: 1 };
    this.updateUrl();
  }

  onSortChange(sort: string): void {
    this.filter = { ...this.filter, sort, page: 1 };
    this.updateUrl();
  }

  onPageChange(page: number): void {
    this.filter.page = page;
    this.updateUrl();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private updateUrl(): void {
    const qp: any = {};
    if (this.filter.page && this.filter.page > 1) qp['page'] = this.filter.page;
    if (this.filter.categoryId) qp['categoryId'] = this.filter.categoryId;
    if (this.filter.minPrice != null) qp['minPrice'] = this.filter.minPrice;
    if (this.filter.maxPrice != null) qp['maxPrice'] = this.filter.maxPrice;
    if (this.filter.sort) qp['sort'] = this.filter.sort;
    if (this.filter.rating) qp['rating'] = this.filter.rating;
    this.router.navigate([], { relativeTo: this.route, queryParams: qp });
  }
}