// import { Component, inject, Output, EventEmitter } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { PaymentService } from '../../../../core/services/payment.service';
// import { CartService } from '../../../../core/services/cart.service';

// @Component({ selector: 'app-promo-code', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './promo-code.html', styleUrl: './promo-code.css' })
// export class PromoCodeComponent {
//   @Output() discountApplied = new EventEmitter<number>();
//   private paymentSvc = inject(PaymentService);
//   private cartSvc = inject(CartService);

//   code = ''; loading = false; message = ''; success = false; discount = 0;

//   apply(): void {
//     if (!this.code.trim()) return;
//     this.loading = true; this.message = '';
//     this.paymentSvc.validatePromoCode(this.code.trim(), this.cartSvc.cartTotal).subscribe({
//       next: (res) => {
//         this.loading = false;
//         if (res.valid) {
//           this.success = true; this.discount = res.discount;
//           this.message = `✅ Promo applied! You save $${res.discount.toFixed(2)}`;
//           this.discountApplied.emit(res.discount);
//         } else {
//           this.success = false;
//           this.message = res.message ?? '❌ Invalid or expired promo code';
//         }
//       },
//       error: () => { this.loading = false; this.success = false; this.message = '❌ Failed to validate promo code'; }
//     });
//   }

//   remove(): void { this.code = ''; this.message = ''; this.success = false; this.discount = 0; this.discountApplied.emit(0); }
// }

import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../../../core/services/payment.service';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-promo-code',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './promo-code.html',
  styleUrl: './promo-code.css'
})
export class PromoCodeComponent {
  // discountApplied carries both the discount amount AND the promo id, so
  // the parent (CheckoutComponent) can send the id to the backend on
  // createOrder() — that's what links the promo to the order in the DB.
  @Output() discountApplied = new EventEmitter<{ discount: number; promoId: number | null }>();

  private paymentSvc = inject(PaymentService);
  private cartSvc = inject(CartService);

  code = '';
  loading = false;
  message = '';
  success = false;
  discount = 0;

  apply(): void {
    if (!this.code.trim()) return;
    this.loading = true;
    this.message = '';

    this.paymentSvc.validatePromoCode(this.code.trim(), this.cartSvc.cartTotal).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.valid) {
          this.success = true;
          this.discount = res.discount;
          this.message = `✅ Promo applied! You save $${res.discount.toFixed(2)}`;
          // res.promoId comes from the backend Validate endpoint we wrote earlier.
          this.discountApplied.emit({ discount: res.discount, promoId: res.promoId ?? null });
        } else {
          this.success = false;
          this.message = res.message ?? '❌ Invalid or expired promo code';
        }
      },
      error: (err) => {
        this.loading = false;
        this.success = false;
        // Surface the backend message when present, e.g. "Minimum order amount is 100"
        this.message = err?.error?.message ?? '❌ Failed to validate promo code';
      }
    });
  }

  remove(): void {
    this.code = '';
    this.message = '';
    this.success = false;
    this.discount = 0;
    this.discountApplied.emit({ discount: 0, promoId: null });
  }
}