import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../core/services/product.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Category } from '../../../../core/models/product.model';

@Component({ selector: 'app-category-list', standalone: true, imports: [CommonModule, FormsModule], templateUrl: './category-list.html', styleUrl: './category-list.css' })
export class CategoryListComponent implements OnInit {
  private svc = inject(ProductService);
  private notify = inject(NotificationService);
  categories: Category[] = [];
  loading = true;
  showForm = false;
  editItem: Category | null = null;
  formName = ''; formDesc = '';
  saving = false;

  ngOnInit(): void { this.load(); }
  load(): void { this.svc.getCategories().subscribe({ next: c => { this.categories = c; this.loading = false; }, error: () => { this.loading = false; } }); }

  openAdd(): void { this.editItem = null; this.formName = ''; this.formDesc = ''; this.showForm = true; }
  openEdit(c: Category): void { this.editItem = c; this.formName = c.name; this.formDesc = c.description; this.showForm = true; }

  save(): void {
    if (!this.formName.trim()) return;
    this.saving = true;
    const req = this.editItem
      ? this.svc.updateCategory(this.editItem.id, { name: this.formName, description: this.formDesc })
      : this.svc.createCategory({ name: this.formName, description: this.formDesc, isActive: true });
    req.subscribe({ next: () => { this.showForm = false; this.saving = false; this.notify.success('Saved'); this.load(); }, error: () => { this.saving = false; } });
  }

  delete(id: number): void {
    if (!confirm('Delete category?')) return;
    this.svc.deleteCategory(id).subscribe({ next: () => { this.categories = this.categories.filter(c => c.id !== id); this.notify.success('Deleted'); } });
  }
}
