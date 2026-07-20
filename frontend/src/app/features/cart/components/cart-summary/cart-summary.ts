import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Cart } from '../../../../core/models/cart.model';
import { CartService } from '../../../../core/services/cart.service';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';

@Component({ selector: 'app-cart-summary', standalone: true, imports: [CommonModule, RouterLink, CurrencyFormatPipe], templateUrl: './cart-summary.html', styleUrl: './cart-summary.css' })
export class CartSummaryComponent {
  @Input({ required: true }) cart!: Cart;
  cartSvc = inject(CartService);

  get subtotal(): number { return this.cartSvc.cartTotal; }
  get itemCount(): number { return this.cartSvc.cartCount; }
  get shipping(): number { return this.subtotal >= 500 ? 0 : 50; }
  get total(): number { return this.subtotal + this.shipping; }

  clearCart(): void { this.cartSvc.clear().subscribe(); }
}
