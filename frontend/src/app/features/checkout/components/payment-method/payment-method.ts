import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentMethod } from '../../../../core/models/order.model';

@Component({
  selector: 'app-payment-method',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-method.html',
  styleUrl: './payment-method.css'
})
export class PaymentMethodComponent {
  @Output() paymentSelected = new EventEmitter<PaymentMethod>();

  selected: PaymentMethod = 'COD';
  cardNumber = ''; cardExpiry = ''; cardCvv = ''; cardName = '';

  methods: { value: PaymentMethod; label: string; icon: string; desc: string }[] = [
    { value: 'COD',        label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
    { value: 'CreditCard', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, Amex' },
    { value: 'Wallet',     label: 'Wallet Balance',    icon: '👛', desc: 'Use your account balance' },
    { value: 'PayPal',     label: 'PayPal',            icon: '🅿️', desc: 'Pay securely with PayPal' },
  ];

  proceed(): void { this.paymentSelected.emit(this.selected); }
  formatCard(): void { this.cardNumber = this.cardNumber.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim(); }
  formatExpiry(): void { let v = this.cardExpiry.replace(/\D/g,'').slice(0,4); if(v.length>=2) v=v.slice(0,2)+'/'+v.slice(2); this.cardExpiry=v; }
}
