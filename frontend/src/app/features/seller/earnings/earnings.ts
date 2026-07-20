import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SellerService } from '../../../core/services/seller.service';
import { CurrencyFormatPipe } from '../../../shared/pipes/currency-format.pipe';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';

@Component({ selector: 'app-earnings', standalone: true, imports: [CommonModule, CurrencyFormatPipe, DateFormatPipe], templateUrl: './earnings.html', styleUrl: './earnings.css' })
export class EarningsComponent implements OnInit {
  private sellerSvc = inject(SellerService);
  earnings: any = null;
  loading = true;
  requesting = false;
  ngOnInit(): void { this.sellerSvc.getEarnings().subscribe({ next: e => { this.earnings = e; this.loading = false; }, error: () => { this.loading = false; } }); }
  requestPayout(): void { this.requesting = true; this.sellerSvc.requestPayout().subscribe({ next: () => { this.requesting = false; }, error: () => { this.requesting = false; } }); }
}
