import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../core/services/admin.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Banner } from '../../../../core/models/order.model';

@Component({
  selector: 'app-banner-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './banner-list.html',
  styleUrl: './banner-list.css'
})
export class BannerListComponent implements OnInit {
  private adminSvc = inject(AdminService);
  private notify = inject(NotificationService);

  banners: Banner[] = [];
  loading = true;
  showForm = false;
  saving = false;

  // null when creating a new banner, set to the banner id when editing an existing one.
  editingId: number | null = null;

  // Form model. Dates are kept as yyyy-MM-dd strings because that's what <input type="date"> binds to.
  f = this.emptyForm();

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    // Admin view: getAllBanners() returns every banner (active or not, inside or
    // outside the date window). getBanners() returns only "live" banners and
    // would hide drafts/expired ones from the admin.
    this.adminSvc.getAllBanners().subscribe({
      next: b => { this.banners = b; this.loading = false; },
      error: () => { this.loading = false; this.notify.error('Failed to load banners'); }
    });
  }

  openCreate(): void {
    this.editingId = null;
    this.f = this.emptyForm();
    this.showForm = true;
  }

  openEdit(b: Banner): void {
    this.editingId = b.id;
    this.f = {
      title:        b.title ?? '',
      description:  b.description ?? '',
      imageUrl:     b.imageUrl ?? '',
      linkUrl:      b.linkUrl ?? '',
      displayOrder: b.displayOrder ?? 0,
      isActive:     b.isActive ?? true,
      startDate:    this.toDateInput(b.startDate),
      endDate:      this.toDateInput(b.endDate)
    };
    this.showForm = true;
  }

  cancel(): void {
    this.showForm = false;
    this.editingId = null;
  }

  save(): void {
    // Basic client-side validation - server validates too, but this gives faster feedback.
    if (!this.f.title.trim() || !this.f.imageUrl.trim() || !this.f.startDate || !this.f.endDate) {
      this.notify.error('Please fill in Title, Image URL, Start date and Expiry date.');
      return;
    }
    if (new Date(this.f.endDate) < new Date(this.f.startDate)) {
      this.notify.error('Expiry date must be on or after the start date.');
      return;
    }

    const payload: Partial<Banner> = {
      title:        this.f.title.trim(),
      description:  this.f.description?.trim() || undefined,
      imageUrl:     this.f.imageUrl.trim(),
      linkUrl:      this.f.linkUrl?.trim() || undefined,
      displayOrder: Number(this.f.displayOrder) || 0,
      isActive:     !!this.f.isActive,
      startDate:    new Date(this.f.startDate),
      endDate:      new Date(this.f.endDate)
    };

    this.saving = true;
    const req$ = this.editingId == null
      ? this.adminSvc.createBanner(payload)
      : this.adminSvc.updateBanner(this.editingId, payload);

    req$.subscribe({
      next: () => {
        this.saving = false;
        this.showForm = false;
        this.notify.success(this.editingId == null ? 'Banner added' : 'Banner updated');
        this.editingId = null;
        this.load();
      },
      error: (err) => {
        this.saving = false;
        this.notify.error(err?.error?.message || 'Failed to save banner');
      }
    });
  }

  delete(id: number): void {
    if (!confirm('Delete banner?')) return;
    this.adminSvc.deleteBanner(id).subscribe({
      next: () => {
        this.banners = this.banners.filter(b => b.id !== id);
        this.notify.success('Deleted');
      },
      error: () => this.notify.error('Failed to delete banner')
    });
  }

  // ─── helpers ──────────────────────────────────────────────────────────────

  private emptyForm() {
    return {
      title: '',
      description: '',
      imageUrl: '',
      linkUrl: '',
      displayOrder: 0,
      isActive: true,
      startDate: '',
      endDate: ''
    };
  }

  // The backend returns dates as ISO strings (or Date objects). The <input type="date">
  // control needs them formatted as YYYY-MM-DD, otherwise the field stays blank on edit.
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