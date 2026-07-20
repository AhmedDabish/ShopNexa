import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CurrencyFormatPipe } from '../../pipes/currency-format.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyFormatPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() addedToCart = new EventEmitter<void>();

  private cartSvc = inject(CartService);
  private wishlistSvc = inject(WishlistService);
  private notify = inject(NotificationService);
  isAddingToCart = false;

  get primaryImage(): string {
    return this.product.images?.find(i => i.isPrimary)?.imageUrl
      ?? this.product.images?.[0]?.imageUrl
      ?? 'images/placeholder.png';
  }

  get discountPercent(): number {
    if (!this.product.discountPrice) return 0;
    return Math.round((1 - this.product.discountPrice / this.product.price) * 100);
  }

  get inWishlist(): boolean { return this.wishlistSvc.isInWishlist(this.product.id); }
  get isOutOfStock(): boolean { return this.product.stockQuantity === 0; }
  get stars(): number[] { return [1, 2, 3, 4, 5]; }

  addToCart(event: Event): void {
    event.preventDefault(); event.stopPropagation();
    if (this.isAddingToCart || this.isOutOfStock) return;
    this.isAddingToCart = true;
    this.cartSvc.addItem(this.product.id).subscribe({
      next: () => { this.notify.success('Added to cart!'); this.addedToCart.emit(); this.isAddingToCart = false; },
      error: () => { this.isAddingToCart = false; }
    });
  }

  toggleWishlist(event: Event): void {
    event.preventDefault(); event.stopPropagation();
    this.wishlistSvc.toggle(this.product.id).subscribe({
      next: () => this.notify.info(this.inWishlist ? 'Added to wishlist' : 'Removed from wishlist')
    });
  }
}
