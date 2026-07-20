import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service';
import { CartItem } from '../../../../core/models/cart.model';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';

@Component({ selector: 'app-cart-item', standalone: true, imports: [CommonModule, RouterLink, CurrencyFormatPipe], templateUrl: './cart-item.html', styleUrl: './cart-item.css' })
export class CartItemComponent {
  @Input({ required: true }) item!: CartItem;
  cartSvc = inject(CartService);

  get img(): string { return this.item.product?.images?.[0]?.imageUrl ?? 'images/placeholder.png'; }
  get currentPrice(): number { return this.item.product?.discountPrice ?? this.item.product?.price ?? this.item.priceAtAdd; }
  get priceChanged(): boolean { return this.item.priceAtAdd !== (this.item.product?.price ?? this.item.priceAtAdd); }

  setQty(qty: number): void {
    if (qty < 1 || (this.item.product && qty > this.item.product.stockQuantity)) return;
    this.cartSvc.updateItem(this.item.id, qty).subscribe();
  }

  remove(): void { this.cartSvc.removeItem(this.item.id).subscribe(); }
}
