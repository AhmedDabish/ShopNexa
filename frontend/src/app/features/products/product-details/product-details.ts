import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProductService } from '../../../core/services/product.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Product } from '../../../core/models/product.model';
import { Review } from '../../../core/models/product.model';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { ImageGalleryComponent } from './components/image-gallery/image-gallery';
import { ReviewsComponent } from './components/reviews/reviews';
import { RelatedProductsComponent } from './components/related-products/related-products';
import { BreadcrumbComponent } from '../../../shared/components/breadcrumb/breadcrumb';

@Component({
  selector: 'app-product-details',
  standalone: true,
imports: [CommonModule, CurrencyFormatPipe, ImageGalleryComponent, ReviewsComponent, RelatedProductsComponent, BreadcrumbComponent],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css'
})
export class ProductDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productSvc = inject(ProductService);
  private cartSvc = inject(CartService);
  private wishlistSvc = inject(WishlistService);
  private notify = inject(NotificationService);

  product: Product | null = null;
  reviews: Review[] = [];
  loading = true;
  quantity = 1;
  activeTab: 'desc' | 'reviews' = 'desc';
  addingToCart = false;

  get inWishlist(): boolean { return this.wishlistSvc.isInWishlist(this.product?.id ?? 0); }

  get discountPercent(): number {
    if (!this.product?.discountPrice) return 0;
    return Math.round((1 - this.product.discountPrice / this.product.price) * 100);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loading = true;
      forkJoin({ product: this.productSvc.getProduct(id), reviews: this.productSvc.getReviews(id) }).subscribe({
        next: ({ product, reviews }) => { this.product = product; this.reviews = reviews; this.loading = false; },
        error: () => { this.loading = false; }
      });
    });
  }

  increaseQty(): void { if (this.product && this.quantity < this.product.stockQuantity) this.quantity++; }
  decreaseQty(): void { if (this.quantity > 1) this.quantity--; }

  addToCart(): void {
    if (!this.product) return;
    this.addingToCart = true;
    this.cartSvc.addItem(this.product.id, this.quantity).subscribe({
      next: () => { this.notify.success('Product added to cart'); this.addingToCart = false; },
      error: () => { this.addingToCart = false; }
    });
  }

  toggleWishlist(): void {
    if (!this.product) return;
    this.wishlistSvc.toggle(this.product.id).subscribe({ next: () => this.notify.info('Favorites updated') });
  }

  onReviewAdded(r: Review): void { this.reviews = [r, ...this.reviews]; }
}
