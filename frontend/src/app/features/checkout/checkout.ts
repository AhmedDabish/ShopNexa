// import { Component, inject, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { CartService } from '../../core/services/cart.service';
// import { OrderService } from '../../core/services/order.service';
// import { PaymentService } from '../../core/services/payment.service';
// import { PaymentMethod } from '../../core/models/order.model';
// import { NotificationService } from '../../core/services/notification.service';
// import { ShippingAddressComponent } from './components/shipping-address/shipping-address';
// import { PaymentMethodComponent } from './components/payment-method/payment-method';
// import { OrderSummaryComponent } from './components/order-summary/order-summary';
// import { PromoCodeComponent } from './components/promo-code/promo-code';

// @Component({
//   selector: 'app-checkout',
//   standalone: true,
//   imports: [CommonModule, ShippingAddressComponent, PaymentMethodComponent, OrderSummaryComponent, PromoCodeComponent],
//   templateUrl: './checkout.html',
//   styleUrl: './checkout.css'
// })
// export class CheckoutComponent implements OnInit {
//   cartSvc = inject(CartService);
//   private orderSvc = inject(OrderService);
//   private paymentSvc = inject(PaymentService);
//   private notify = inject(NotificationService);
//   private router = inject(Router);

//   step = 1;
//   steps = ['Shipping Address', 'Payment Method', 'Review Order', 'Confirmation'];

//   selectedAddressId: number | null = null;
//   selectedPaymentMethod: PaymentMethod | null = null;
//   promoDiscount = 0;
//   placingOrder = false;
//   orderNumber = '';

//   ngOnInit(): void { this.cartSvc.loadCart().subscribe(); }

//   onAddressSelected(id: number): void { this.selectedAddressId = id; this.step = 2; }
//   onPaymentSelected(method: PaymentMethod): void { this.selectedPaymentMethod = method; this.step = 3; }
//   onPromoApplied(discount: number): void { this.promoDiscount = discount; }

//   placeOrder(): void {
//     if (!this.selectedAddressId || !this.selectedPaymentMethod) return;
//     this.placingOrder = true;
//     this.orderSvc.createOrder({ shippingAddressId: this.selectedAddressId, paymentMethod: this.selectedPaymentMethod }).subscribe({
//       next: (order) => {
//         this.orderNumber = order.orderNumber;
//         this.cartSvc.clear().subscribe();
//         this.step = 4;
//         this.placingOrder = false;
//       },
//       error: () => { this.placingOrder = false; }
//     });
//   }
// }
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { PaymentService } from '../../core/services/payment.service';
import { AuthService } from '../../core/services/auth.service';
import { PaymentMethod } from '../../core/models/order.model';
import { NotificationService } from '../../core/services/notification.service';
import { ShippingAddressComponent } from './components/shipping-address/shipping-address';
import { PaymentMethodComponent } from './components/payment-method/payment-method';
import { OrderSummaryComponent } from './components/order-summary/order-summary';
import { PromoCodeComponent } from './components/promo-code/promo-code';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterLink,
    ShippingAddressComponent, PaymentMethodComponent,
    OrderSummaryComponent, PromoCodeComponent
  ],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class CheckoutComponent implements OnInit {
  appliedPromoId: number | null = null;
  cartSvc = inject(CartService);
  authSvc = inject(AuthService);
  private orderSvc = inject(OrderService);
  private paymentSvc = inject(PaymentService);
  private notify = inject(NotificationService);
  private router = inject(Router);

  // Mode selection: 'choose' is the landing screen for guests (Login vs
  // Continue as Guest); after they pick, mode becomes 'auth' or 'guest'.
  // For an already logged-in user we skip straight to 'auth'.
  mode: 'choose' | 'auth' | 'guest' = 'choose';

  step = 1;
  steps = ['Shipping Address', 'Payment Method', 'Review Order', 'Confirmation'];

  // Auth-mode state
  selectedAddressId: number | null = null;
  selectedPaymentMethod: PaymentMethod | null = null;
  promoDiscount = 0;

  // Guest-mode form state
  guest = {
    email: '', fullName: '', phoneNumber: '',
    street: '', city: '', state: '', zipCode: '', country: 'Egypt',
    paymentMethod: 'COD' as PaymentMethod,
    notes: ''
  };

  placingOrder = false;
  orderNumber = '';

  get isLoggedIn(): boolean { return this.authSvc.isLoggedIn; }

  ngOnInit(): void {
    if (this.isLoggedIn) {
      this.mode = 'auth';
      this.cartSvc.loadCart().subscribe();
    } else {
      // Guests still need to see their cart items in the order summary,
      // but the cart is stored client-side only for them.
      this.mode = 'choose';
    }
  }

  // ─── auth-mode handlers ──────────────────────────────────────────────────
  onAddressSelected(id: number): void { this.selectedAddressId = id; this.step = 2; }
  onPaymentSelected(method: PaymentMethod): void { this.selectedPaymentMethod = method; this.step = 3; }
  // onPromoApplied(discount: number): void { this.promoDiscount = discount; }

onPromoApplied(payload: { discount: number; promoId: number | null }): void {
  this.promoDiscount = payload.discount;
  this.appliedPromoId = payload.promoId;
}
  // placeOrder(): void {
  //   if (!this.selectedAddressId || !this.selectedPaymentMethod) return;
  //   this.placingOrder = true;
  //   this.orderSvc.createOrder({
  //     shippingAddressId: this.selectedAddressId,
  //     paymentMethod: this.selectedPaymentMethod
  //   }).subscribe({
  //     next: (order) => {
  //       this.orderNumber = order.orderNumber;
  //       this.cartSvc.clear().subscribe();
  //       this.step = 4;
  //       this.placingOrder = false;
  //     },
  //     error: () => { this.placingOrder = false; }
  //   });
  // }

  placeOrder(): void {
  if (!this.selectedAddressId || !this.selectedPaymentMethod) return;
  this.placingOrder = true;
  this.orderSvc.createOrder({
    shippingAddressId: this.selectedAddressId,
    paymentMethod: this.selectedPaymentMethod,
    // Pass the promo discount info so the backend records it on the order.
    // The backend recomputes the discount from PromoCodeId for safety,
    // we just need to send which code was applied.
    promoCodeId: this.appliedPromoId ?? undefined
  } as any).subscribe({
    next: (order) => {
      this.orderNumber = order.orderNumber;
      this.cartSvc.clear().subscribe();
      this.step = 4;
      this.placingOrder = false;
    },
    error: () => { this.placingOrder = false; }
  });
}
  // ─── guest-mode handlers ─────────────────────────────────────────────────
  goLogin(): void {
    // Bring them back to /checkout after they log in so the cart is preserved.
    this.router.navigate(['/auth/login'], { queryParams: { returnUrl: '/checkout' } });
  }

  continueAsGuest(): void { this.mode = 'guest'; }

  placeGuestOrder(): void {
    // Front-end validation. The backend re-validates and the form fields
    // have HTML5 `required` on them, but this gives faster feedback.
    if (!this.guest.email || !this.guest.fullName || !this.guest.phoneNumber
        || !this.guest.street || !this.guest.city || !this.guest.country) {
      this.notify.error('Please fill in all required fields.');
      return;
    }

    // Build the cart payload from the CartService.
    // cartSvc.cartItems is a typed getter that returns CartItem[] —
    // safer than poking at the BehaviorSubject directly.
    const items = this.cartSvc.cartItems.map(ci => ({
      productId: ci.productId,
      quantity: ci.quantity
    }));
    if (!items.length) {
      this.notify.error('Your cart is empty.');
      return;
    }

    this.placingOrder = true;
    this.orderSvc.createGuestOrder({
      ...this.guest,
      items
    }).subscribe({
      next: (res) => {
        this.orderNumber = res.orderNumber;
        this.cartSvc.clearState();
        this.step = 4;
        this.placingOrder = false;
        this.notify.success(`Order ${res.orderNumber} placed!`);
      },
      error: (err) => {
        this.placingOrder = false;
        this.notify.error(err?.error?.message || 'Failed to place order');
      }
    });
  }
}