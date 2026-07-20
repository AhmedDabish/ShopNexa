import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductService } from '../../../../core/services/product.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { Category } from '../../../../core/models/product.model';

@Component({ selector: 'app-edit-product', standalone: true, imports: [CommonModule, ReactiveFormsModule, RouterLink], templateUrl: './edit-product.html', styleUrl: './edit-product.css' })
export class EditProductComponent implements OnInit {
  private svc = inject(ProductService);
  private notify = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  categories: Category[] = [];
  loading = true;
  saving = false;
  productId!: number;
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

  ngOnInit(): void {
    this.productId = +this.route.snapshot.params['id'];
    this.svc.getCategories().subscribe(c => this.categories = c);
    this.svc.getProduct(this.productId).subscribe({ next: (p) => { this.form.patchValue({ name: p.name, description: p.description, price: p.price, discountPrice: p.discountPrice ?? null, stockQuantity: p.stockQuantity, sku: p.sku, categoryId: p.categoryId, isActive: p.isActive }); this.loading = false; }, error: () => { this.loading = false; } });
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.svc.updateProduct(this.productId, this.form.value as any).subscribe({
      next: () => { this.notify.success('Product updated'); this.router.navigateByUrl(this.listUrl);},
      error: () => { this.saving = false; }
    });
  }
}
