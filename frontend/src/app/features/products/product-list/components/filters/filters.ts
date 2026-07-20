import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category, ProductFilter } from '../../../../../core/models/product.model';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filters.html',
  styleUrl: './filters.css'
})
export class FiltersComponent implements OnChanges {
  @Input() categories: Category[] = [];
  @Input() currentFilter: ProductFilter = {};
  @Output() filterChange = new EventEmitter<Partial<ProductFilter>>();

  minPrice: number | null = null;
  maxPrice: number | null = null;
  selectedCategory: number | null = null;
  selectedRating: number | null = null;

  // Sync the form fields whenever the parent's filter changes (i.e. when the
  // URL queryParams update). Using OnChanges instead of OnInit means the
  // controls stay in sync if the user navigates back/forward or hits "Reset
  // filters" from the empty-state link.
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentFilter']) {
      this.minPrice         = this.currentFilter.minPrice   ?? null;
      this.maxPrice         = this.currentFilter.maxPrice   ?? null;
      this.selectedCategory = this.currentFilter.categoryId ?? null;
      this.selectedRating   = this.currentFilter.rating     ?? null;
    }
  }

  apply(): void {
    // Light validation: if both bounds are set, swap them when min > max
    // so the user doesn't end up with an empty result by accident.
    let lo = this.minPrice;
    let hi = this.maxPrice;
    if (lo != null && hi != null && lo > hi) {
      [lo, hi] = [hi, lo];
    }

    this.filterChange.emit({
      categoryId: this.selectedCategory ?? undefined,
      minPrice:   lo ?? undefined,
      maxPrice:   hi ?? undefined,
      rating:     this.selectedRating   ?? undefined
    });
  }

  reset(): void {
    this.minPrice = null;
    this.maxPrice = null;
    this.selectedCategory = null;
    this.selectedRating = null;
    // Send undefined for every key so the parent strips them from the URL too.
    this.filterChange.emit({
      categoryId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      rating: undefined
    });
  }
}