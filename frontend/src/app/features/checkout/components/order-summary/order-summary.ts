// import { Component, Input } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterLink } from '@angular/router';
// import { Cart } from '../../../../core/models/cart.model';
// import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';

// @Component({
//   selector: 'app-order-summary',
//   standalone: true,
//   imports: [CommonModule, RouterLink, CurrencyFormatPipe],
//   templateUrl: './order-summary.html',
//   styleUrl: './order-summary.css'
// })
// export class OrderSummaryComponent {
//   @Input() cart!: Cart;
//   @Input() promoDiscount = 0;

//   get items() { return this.cart?.cartItems ?? []; }

//   get subtotal(): number {
//     return this.items.reduce((s, i) => {
//       const p = i.product?.discountPrice ?? i.product?.price ?? i.priceAtAdd;
//       return s + p * i.quantity;
//     }, 0);
//   }

//   get shipping(): number { return this.subtotal >= 500 ? 0 : 50; }
//   get total(): number { return this.subtotal + this.shipping - this.promoDiscount; }

//   getItemImg(item: any): string {
//     return item.product?.images?.[0]?.imageUrl ?? 'images/placeholder.png';
//   }
// }
import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Cart } from '../../../../core/models/cart.model';
import { CartService } from '../../../../core/services/cart.service';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyFormatPipe],
  templateUrl: './order-summary.html',
  styleUrl: './order-summary.css'
})
export class OrderSummaryComponent implements OnInit {
  // Optional input: parent can pass a cart explicitly. If it doesn't, we fall
  // back to the CartService BehaviorSubject — that's what fixes the
  // <app-order-summary /> usages that were rendering $0.00 because no input
  // was being supplied.
  @Input() cart?: Cart | null;
  @Input() promoDiscount = 0;

  private cartSvc = inject(CartService);

  ngOnInit(): void {
    // If no cart was passed in, ask the service to (re)load and subscribe
    // for future updates. Cheap: loadCart() is a noop if the cart is already
    // cached on the service.
    if (!this.cart) {
      this.cartSvc.loadCart().subscribe({
        // Swallow errors — for guests there's no /api/Cart endpoint that
        // works without auth, but the BehaviorSubject still holds anything
        // they added client-side.
        error: () => {}
      });
    }
  }

  get items() {
    // Priority: explicit input → service value. Either may be null.
    return (this.cart?.cartItems ?? this.cartSvc.cartItems) ?? [];
  }

  get subtotal(): number {
    return this.items.reduce((s, i) => {
      const p = i.product?.discountPrice ?? i.product?.price ?? i.priceAtAdd;
      return s + p * i.quantity;
    }, 0);
  }

  get shipping(): number { return this.subtotal >= 500 ? 0 : 50; }
  get total(): number { return this.subtotal + this.shipping - this.promoDiscount; }

  getItemImg(item: any): string {
    return item.product?.images?.[0]?.imageUrl ?? 'images/placeholder.png';
  }
}