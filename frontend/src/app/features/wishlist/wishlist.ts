import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import { CurrencyFormatPipe } from '../../shared/pipes/currency-format.pipe';

@Component({ selector: 'app-wishlist', standalone: true, imports: [CommonModule, RouterLink, CurrencyFormatPipe], templateUrl: './wishlist.html', styleUrl: './wishlist.css' })
export class WishlistComponent implements OnInit {
  wishlistSvc = inject(WishlistService);
  private cartSvc = inject(CartService);
  private notify = inject(NotificationService);

  ngOnInit(): void { this.wishlistSvc.load().subscribe(); }

  getImg(item: any): string { return item.product?.images?.[0]?.imageUrl ?? 'images/placeholder.png'; }

  addToCart(item: any): void {
    this.cartSvc.addItem(item.productId).subscribe({
      next: () => this.notify.success('Added to cart!')
    });
  }

  remove(item: any): void {
    // DELETE /api/Wishlist/items/{productId}
    this.wishlistSvc.remove(item.productId).subscribe({
      next: () => this.notify.info('Removed from wishlist')
    });
  }
}
