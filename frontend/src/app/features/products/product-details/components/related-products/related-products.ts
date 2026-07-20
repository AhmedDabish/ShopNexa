import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../../../core/services/product.service';
import { Product } from '../../../../../core/models/product.model';
import { ProductCardComponent } from '../../../../../shared/components/product-card/product-card';

@Component({ selector: 'app-related-products', standalone: true, imports: [CommonModule, ProductCardComponent], templateUrl: './related-products.html', styleUrl: './related-products.css' })
export class RelatedProductsComponent implements OnInit {
  @Input() categoryId!: number;
  @Input() excludeId!: number;
  private svc = inject(ProductService);
  products: Product[] = [];
  ngOnInit(): void {
    this.svc.getByCategory(this.categoryId).subscribe(ps => this.products = ps.filter(p => p.id !== this.excludeId).slice(0, 6));
  }
}
