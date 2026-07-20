import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdminService } from '../../../../core/services/admin.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Order, OrderStatus } from '../../../../core/models/order.model';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';

@Component({ selector: 'app-admin-order-list', standalone: true, imports: [CommonModule, RouterLink, DateFormatPipe, CurrencyFormatPipe], templateUrl: './order-list.html', styleUrl: './order-list.css' })
export class AdminOrderListComponent implements OnInit {
  private adminSvc = inject(AdminService);
  private notify = inject(NotificationService);
  orders: Order[] = [];
  loading = true;

  statuses: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  statusLabels: Record<OrderStatus, string> = {
    Pending: 'Pending', Processing: 'Processing',
    Shipped: 'Shipped', Delivered: 'Delivered', Cancelled: 'Cancelled'
  };

  ngOnInit(): void { this.adminSvc.getOrders().subscribe({ next: o => { this.orders = o; this.loading = false; }, error: () => { this.loading = false; } }); }

  updateStatus(order: Order, status: OrderStatus): void {
    this.adminSvc.updateOrderStatus(order.id, status).subscribe({
      next: () => { order.status = status; this.notify.success('Order status updated'); }
    });
  }
}
