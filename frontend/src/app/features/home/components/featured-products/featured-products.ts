import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../core/models/product.model';
import { ProductCardComponent } from '../../../../shared/components/product-card/product-card';

@Component({ selector: 'app-featured-products', standalone: true, imports: [CommonModule, RouterLink, ProductCardComponent], templateUrl: './featured-products.html', styleUrl: './featured-products.css' })
export class FeaturedProductsComponent {
  @Input() products: Product[] = [];
}
