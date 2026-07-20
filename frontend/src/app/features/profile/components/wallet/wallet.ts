import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../core/services/user.service';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';

@Component({ selector: 'app-wallet', standalone: true, imports: [CommonModule, CurrencyFormatPipe, DateFormatPipe], templateUrl: './wallet.html', styleUrl: './wallet.css' })
export class WalletComponent implements OnInit {
  private userSvc = inject(UserService);
  balance = 0;
  transactions: any[] = [];
  loading = true;

  ngOnInit(): void {
    this.userSvc.getWallet().subscribe({ next: (w) => { this.balance = w.balance; this.transactions = w.transactions ?? []; this.loading = false; }, error: () => { this.loading = false; } });
  }
}
