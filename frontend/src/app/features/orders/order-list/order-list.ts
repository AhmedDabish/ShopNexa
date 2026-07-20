import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DateFormatPipe, CurrencyFormatPipe],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css'
})
export class OrderListComponent implements OnInit {
  private orderSvc = inject(OrderService);
  orders: Order[] = [];
  filtered: Order[] = [];
  loading = true;
  activeStatus = 'all';

  statuses = [
    { value: 'all',        label: 'All Orders' },
    { value: 'Pending',    label: 'Pending' },
    { value: 'Processing', label: 'Processing' },
    { value: 'Shipped',    label: 'Shipped' },
    { value: 'Delivered',  label: 'Delivered' },
    { value: 'Cancelled',  label: 'Cancelled' },
  ];

  ngOnInit(): void {
    this.orderSvc.getUserOrders().subscribe({
      next: (o) => { this.orders = o; this.filtered = o; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  filterBy(status: string): void {
    this.activeStatus = status;
    this.filtered = status === 'all' ? this.orders : this.orders.filter(o => o.status === status);
  }

  statusLabel(s: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
      Pending: 'Pending', Processing: 'Processing',
      Shipped: 'Shipped', Delivered: 'Delivered', Cancelled: 'Cancelled'
    };
    return map[s] ?? s;
  }
}
