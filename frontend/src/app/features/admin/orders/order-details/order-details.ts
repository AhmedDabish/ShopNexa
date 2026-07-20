import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { Order, OrderStatus } from '../../../../core/models/order.model';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';

@Component({ selector: 'app-admin-order-details', standalone: true, imports: [CommonModule, RouterLink, CurrencyFormatPipe, DateFormatPipe], template: `
  <a routerLink="/admin/orders" class="back">← Orders list</a>
  @if (order) {
    <h2>Order #{{ order.orderNumber }}</h2>
    <p>Status: <strong>{{ order.status }}</strong></p>
    <p>Total: <strong>{{ order.totalAmount | currencyFormat }}</strong></p>
    <p>Date: {{ order.orderDate | dateFormat:'long' }}</p>
  }
`, styles: [`.back{font-size:13px;color:#2563eb;text-decoration:none;display:block;margin-bottom:16px} h2{font-size:20px;font-weight:700;margin-bottom:12px} p{font-size:14px;color:#4b5563;margin-bottom:8px}`] })
export class AdminOrderDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderSvc = inject(OrderService);
  order: Order | null = null;
  ngOnInit(): void { this.orderSvc.getOrder(+this.route.snapshot.params['id']).subscribe(o => this.order = o); }
}
