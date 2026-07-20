import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService } from '../../../../../core/services/product.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { Review } from '../../../../../core/models/product.model';
import { DateFormatPipe } from '../../../../../shared/pipes/date-format.pipe';

@Component({ selector: 'app-reviews', standalone: true, imports: [CommonModule, ReactiveFormsModule, DateFormatPipe], templateUrl: './reviews.html', styleUrl: './reviews.css' })
export class ReviewsComponent {
  @Input() productId!: number;
  @Input() reviews: Review[] = [];
  @Output() reviewAdded = new EventEmitter<Review>();

  private fb = inject(FormBuilder);
  private productSvc = inject(ProductService);
  auth = inject(AuthService);
  private notify = inject(NotificationService);

  form = this.fb.group({ rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]], comment: [''] });
  loading = false;
  hoverRating = 0;

  get avgRating(): number {
    if (!this.reviews.length) return 0;
    return this.reviews.reduce((s, r) => s + r.rating, 0) / this.reviews.length;
  }

  get ratingDist(): { stars: number; count: number; pct: number }[] {
    return [5,4,3,2,1].map(s => {
      const count = this.reviews.filter(r => r.rating === s).length;
      return { stars: s, count, pct: this.reviews.length ? Math.round(count/this.reviews.length*100) : 0 };
    });
  }

  setRating(r: number): void { this.form.patchValue({ rating: r }); }

  submit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.productSvc.addReview({ productId: this.productId, rating: this.form.value.rating!, comment: this.form.value.comment || undefined }).subscribe({
      next: (r) => { this.reviewAdded.emit(r); this.form.reset({ rating: 5, comment: '' }); this.loading = false; this.notify.success('Your review has been added'); },
      error: () => { this.loading = false; }
    });
  }
}
