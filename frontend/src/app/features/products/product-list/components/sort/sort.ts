import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sort',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="sort-wrap">
      <svg class="sort-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="16"/>
      </svg>
      <select class="sort-select" [(ngModel)]="selected" (change)="sortChange.emit(selected)">
        <option value="">Sort: Default</option>
        <option value="price-asc">Price: Low → High</option>
        <option value="price-desc">Price: High → Low</option>
        <option value="rating-desc">Highest Rated</option>
        <option value="newest">Newest First</option>
      </select>
      <svg class="chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
  `,
  styles: [`
    .sort-wrap {
      display: flex; align-items: center; gap: 8px;
      padding: 0 14px; height: 42px;
      background: var(--c-white);
      border: 1.5px solid var(--c-border);
      border-radius: var(--r-md);
      cursor: pointer;
      transition: border-color 150ms;
      position: relative;
    }
    .sort-wrap:focus-within { border-color: var(--c-primary); box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }
    .sort-icon { color: var(--c-ink-3); flex-shrink: 0; }
    .sort-select {
      border: none; outline: none; background: transparent;
      font-size: 13px; font-weight: 600; color: var(--c-ink-2);
      font-family: inherit; cursor: pointer;
      appearance: none; padding-right: 4px;
    }
    .chevron { color: var(--c-ink-4); flex-shrink: 0; }
  `]
})
export class SortComponent implements OnChanges {
  // Parent passes the current sort value (read from the URL) so that on page
  // load / refresh the dropdown reflects what's actually being applied,
  // instead of always showing "Sort: Default".
  @Input() value: string = '';
  @Output() sortChange = new EventEmitter<string>();

  selected = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.selected = this.value ?? '';
    }
  }
}