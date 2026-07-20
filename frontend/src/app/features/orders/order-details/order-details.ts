import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Order, OrderStatus } from '../../../core/models/order.model';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterLink, DateFormatPipe, CurrencyFormatPipe],
  templateUrl: './order-details.html',
  styleUrl: './order-details.css'
})
export class OrderDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderSvc = inject(OrderService);
  private notify = inject(NotificationService);
  order: Order | null = null;
  loading = true;
  cancelling = false;

  statusLabel(s: OrderStatus): string {
    const map: Record<OrderStatus, string> = { Pending: 'Pending', Processing: 'Processing', Shipped: 'Shipped', Delivered: 'Delivered', Cancelled: 'Cancelled' };
    return map[s] ?? s;
  }

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.orderSvc.getOrder(id).subscribe({
      next: (o) => { this.order = o; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  cancel(): void {
    if (!this.order) return;
    this.cancelling = true;
    this.orderSvc.cancelOrder(this.order.id).subscribe({
      next: () => { this.order!.status = 'Cancelled'; this.cancelling = false; this.notify.success('Order cancelled'); },
      error: () => { this.cancelling = false; }
    });
  }
}
