import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CartItemComponent } from './components/cart-item/cart-item';
import { CartSummaryComponent } from './components/cart-summary/cart-summary';

@Component({ selector: 'app-cart', standalone: true, imports: [CommonModule, RouterLink, CartItemComponent, CartSummaryComponent], templateUrl: './cart.html', styleUrl: './cart.css' })
export class CartComponent implements OnInit {
  cartSvc = inject(CartService);
  ngOnInit(): void { this.cartSvc.loadCart().subscribe(); }
}
