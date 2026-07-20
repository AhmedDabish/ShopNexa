import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../core/services/order.service';
import { TrackingInfo } from '../../../core/models/order.model';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, RouterLink, DateFormatPipe],
  templateUrl: './order-tracking.html',
  styleUrl: './order-tracking.css'
})
export class OrderTrackingComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private orderSvc = inject(OrderService);
  tracking: TrackingInfo | null = null;
  loading = true;

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.orderSvc.trackOrder(id).subscribe({
      next: (t) => { this.tracking = t; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}
