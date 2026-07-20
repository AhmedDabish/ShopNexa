import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../core/services/admin.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PromoCode } from '../../../../core/models/order.model';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { CurrencyFormatPipe } from '../../../../shared/pipes/currency-format.pipe';

@Component({
  selector: 'app-promo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, DateFormatPipe, CurrencyFormatPipe],
  templateUrl: './promo-list.html',
  styleUrl: './promo-list.css'
})
export class PromoListComponent implements OnInit {
  private adminSvc = inject(AdminService);
  private notify = inject(NotificationService);

  promos: PromoCode[] = [];
  loading = true;
  showForm = false;
  saving = false;
  editItem: PromoCode | null = null;

  f = this.emptyForm();

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.adminSvc.getPromoCodes().subscribe({
      next: p => { this.promos = p; this.loading = false; },
      error: () => { this.loading = false; this.notify.error('Failed to load coupons'); }
    });
  }

  openAdd(): void {
    this.editItem = null;
    this.f = this.emptyForm();
    this.showForm = true;
  }

  openEdit(p: PromoCode): void {
    this.editItem = p;
    this.f = {
      code: p.code ?? '',
      description: p.description ?? '',
      discountType: (p.discountType as 'Percentage' | 'FixedAmount') ?? 'Percentage',
      discountValue: p.discountValue ?? 0,
      minimumOrderAmount: p.minimumOrderAmount ?? 0,
      maxUsageCount: p.maxUsageCount ?? 0,
      startDate: this.toDateInput(p.startDate),
      endDate: this.toDateInput(p.endDate),
      isActive: p.isActive ?? true
    };
    this.showForm = true;
  }

  save(): void {
    // Client-side validation. The backend rejects with 400 if any required
    // field is missing or the dates can't be parsed. The original code sent
    // empty strings for startDate / endDate which fail DateTime binding.
    if (!this.f.code.trim()) {
      this.notify.error('Code is required.');
      return;
    }
    if (!this.f.description.trim()) {
      this.notify.error('Description is required.');
      return;
    }
    if (this.f.discountValue <= 0) {
      this.notify.error('Discount value must be greater than 0.');
      return;
    }
    if (this.f.discountType === 'Percentage' && this.f.discountValue > 100) {
      this.notify.error('Percentage discount cannot exceed 100.');
      return;
    }
    if (!this.f.startDate || !this.f.endDate) {
      this.notify.error('Start date and end date are required.');
      return;
    }
    if (new Date(this.f.endDate) < new Date(this.f.startDate)) {
      this.notify.error('End date must be on or after the start date.');
      return;
    }

    // Build the payload the backend expects. Important conversions:
    //   - "yyyy-MM-dd" from <input type="date"> → ISO string for DateTime binding
    //   - empty / zero "minimumOrderAmount" and "maxUsageCount" → null (since
    //     the backend properties are decimal? and int?)
    const payload: any = {
      // When editing, include the Id so the controller's `id != promo.Id` check passes.
      id: this.editItem ? this.editItem.id : 0,
      code: this.f.code.trim().toUpperCase(),
      description: this.f.description.trim(),
      discountType: this.f.discountType,
      discountValue: Number(this.f.discountValue),
      minimumOrderAmount: this.f.minimumOrderAmount > 0 ? Number(this.f.minimumOrderAmount) : null,
      maxUsageCount: this.f.maxUsageCount > 0 ? Number(this.f.maxUsageCount) : null,
      usedCount: this.editItem?.usedCount ?? 0,
      startDate: new Date(this.f.startDate).toISOString(),
      endDate: new Date(this.f.endDate).toISOString(),
      isActive: !!this.f.isActive
    };

    this.saving = true;
    const req$ = this.editItem
      ? this.adminSvc.updatePromoCode(this.editItem.id, payload)
      : this.adminSvc.createPromoCode(payload);

    req$.subscribe({
      next: () => {
        this.saving = false;
        this.showForm = false;
        this.notify.success(this.editItem ? 'Coupon updated' : 'Coupon added');
        this.editItem = null;
        this.load();
      },
      error: (err) => {
        this.saving = false;
        // Surface the backend's actual message when present, so a 400 isn't
        // silent — easier to debug than a generic "failed to save".
        const msg = err?.error?.message
          || err?.error?.title
          || (typeof err?.error === 'string' ? err.error : null)
          || 'Failed to save coupon';
        this.notify.error(msg);
      }
    });
  }

  cancel(): void {
    this.showForm = false;
    this.editItem = null;
  }

  delete(id: number): void {
    if (!confirm('Delete coupon?')) return;
    this.adminSvc.deletePromoCode(id).subscribe({
      next: () => {
        this.promos = this.promos.filter(p => p.id !== id);
        this.notify.success('Deleted');
      },
      error: () => this.notify.error('Failed to delete coupon')
    });
  }

  // ─── helpers ──────────────────────────────────────────────────────────────

  private emptyForm() {
    return {
      code: '',
      description: '',
      discountType: 'Percentage' as 'Percentage' | 'FixedAmount',
      discountValue: 0,
      minimumOrderAmount: 0,
      maxUsageCount: 0,
      startDate: '',
      endDate: '',
      isActive: true
    };
  }

  // <input type="date"> needs YYYY-MM-DD, not an ISO string with time.
  private toDateInput(d: Date | string | null | undefined): string {
    if (!d) return '';
    const dt = (d instanceof Date) ? d : new Date(d);
    if (isNaN(dt.getTime())) return '';
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const dd = String(dt.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
}