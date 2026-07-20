import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Category } from '../../../../core/models/product.model';

@Component({ selector: 'app-add-product', standalone: true, imports: [CommonModule, ReactiveFormsModule, RouterLink], templateUrl: './add-product.html', styleUrl: './add-product.css' })
export class AddProductComponent implements OnInit {
  private svc = inject(ProductService);
  private notify = inject(NotificationService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  categories: Category[] = [];
  saving = false;
  selectedImages: File[] = [];
  get listUrl(): string {
  return this.router.url.startsWith('/seller') ? '/seller/products' : '/admin/products';
}

  form = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    discountPrice: [null as number | null],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
    sku: ['', Validators.required],
    categoryId: [null as number | null, Validators.required],
    isActive: [true]
  });

  ngOnInit(): void { this.svc.getCategories().subscribe(c => this.categories = c); }

  onFilesChange(e: Event): void {
    const el = e.target as HTMLInputElement;
    this.selectedImages = el.files ? Array.from(el.files) : [];
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const fd = new FormData();
    Object.entries(this.form.value).forEach(([k, v]) => { if (v != null) fd.append(k, String(v)); });
    this.selectedImages.forEach(f => fd.append('images', f));
    this.svc.createProduct(fd).subscribe({
      next: () => { this.notify.success('Product added'); this.router.navigateByUrl(this.listUrl); },
      error: () => { this.saving = false; }
    });
  }
}
