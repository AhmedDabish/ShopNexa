import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../core/services/product.service';
import { AdminService } from '../../core/services/admin.service';
import { Product, Category } from '../../core/models/product.model';
import { Banner } from '../../core/models/order.model';
import { HeroSliderComponent } from './components/hero-slider/hero-slider';
import { FeaturedProductsComponent } from './components/featured-products/featured-products';
import { CategoriesSectionComponent } from './components/categories-section/categories-section';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, HeroSliderComponent, FeaturedProductsComponent, CategoriesSectionComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  private productSvc = inject(ProductService);
  private adminSvc = inject(AdminService);

  featuredProducts: Product[] = [];
  categories: Category[] = [];
  banners: Banner[] = [];
  loading = true;

  ngOnInit(): void {
    forkJoin({
      featured: this.productSvc.getFeatured(),
      categories: this.productSvc.getCategories(),
      banners: this.adminSvc.getBanners()
    }).subscribe({
      next: ({ featured, categories, banners }) => {
        this.featuredProducts = featured;
        this.categories = categories.filter(c => c.isActive);
        this.banners = banners.filter(b => b.isActive);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
}
