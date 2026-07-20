import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooterService, FooterItem } from '../../../core/services/footer.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-admin-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './footer-content.html',
  styleUrl: './footer-content.css'
})
export class FooterContentComponent implements OnInit, OnDestroy {
  private footerSvc = inject(FooterService);
  private notify = inject(NotificationService);
  private destroy$ = new Subject<void>();

  items: FooterItem[] = [];
  loading = false;

  editing: FooterItem | null = null;
  draft: Partial<FooterItem> = this.blankItem();

  sections = [
  
    { key: 'contact', label: 'Contact Info' }
  
  ];

  ngOnInit(): void { this.refresh(); }

  refresh(): void {
    this.loading = true;
    this.footerSvc.listAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: items => {
          this.items = items;
          this.loading = false;
          // Ensure contact section exists with default data on first load
          this.ensureDefaultContactItems();
        },
        error: () => { this.loading = false; this.notify.error('Failed to load footer items'); }
      });
  }

  private ensureDefaultContactItems(): void {
    const hasContact = this.items.some(i => i.section === 'contact');
    if (!hasContact) {
      // Auto-create default contact items
      const defaults = [
        { section: 'contact', label: '+1 800 123 4567', icon: 'phone', sortOrder: 1, isActive: true },
        { section: 'contact', label: 'support@shopapp.com', icon: 'email', sortOrder: 2, isActive: true },
        { section: 'contact', label: 'Mon–Sat, 9am–6pm', icon: 'clock', sortOrder: 3, isActive: true }
      ];
      defaults.forEach(item => {
        this.footerSvc.create(item)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => this.refresh(),
            error: () => { /* fail silently */ }
          });
      });
    }
  }

  itemsBySection(section: string): FooterItem[] {
    return this.items
      .filter(i => i.section === section)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  // startEdit(item: FooterItem): void {
  //   this.editing = item;
  //   this.draft = { ...item };
  // }

  // startNew(section: string): void {
  //   this.editing = null;
  //   this.draft = { ...this.blankItem(), section };
  // }

startNew(section: string): void {
  this.editing = null;
  this.draft = { ...this.blankItem(), section };   // section يتم تعيينها من الزر
}

startEdit(item: FooterItem): void {
  this.editing = item;
  this.draft = { ...item };
}

cancel(): void {
  this.editing = null;
  this.draft = this.blankItem();   // section تصبح فارغة فتختفي النافذة
}
save(): void {
  if (!this.draft.label || !this.draft.section) {
    this.notify.error('Section and label are required');
    return;
  }
  const op = this.editing
    ? this.footerSvc.update(this.editing.id, this.draft)
    : this.footerSvc.create(this.draft);

  op.pipe(takeUntil(this.destroy$)).subscribe({
    next: () => {
      this.notify.success(this.editing ? 'Item updated' : 'Item added');
      this.cancel();   // ← هذا يغلق النافذة
      this.refresh();
    },
    error: err => this.notify.error(err?.error?.message || 'Save failed')
  });
}

  toggleActive(item: FooterItem): void {
    this.footerSvc.update(item.id, { ...item, isActive: !item.isActive })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => { item.isActive = !item.isActive; },
        error: () => this.notify.error('Update failed')
      });
  }

  delete(item: FooterItem): void {
    if (!confirm(`Delete "${item.label}"?`)) return;
    this.footerSvc.delete(item.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => { this.items = this.items.filter(i => i.id !== item.id); this.notify.success('Deleted'); },
        error: () => this.notify.error('Delete failed')
      });
  }

  // private blankItem(): Partial<FooterItem> {
  //   return { section: 'quick_links', label: '', url: '', icon: '', sortOrder: 0, isActive: true };
  // }
private blankItem(): Partial<FooterItem> {
  return { section: '', label: '', url: '', icon: '', sortOrder: 0, isActive: true };
}
  // Quick edit for contact info
  quickEditContact(section: string = 'contact'): void {
    const items = this.itemsBySection(section);
    if (items.length > 0) {
      this.startEdit(items[0]);
    } else {
      this.startNew(section);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}