import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loading$ | async) {
      <div class="overlay">
        <div class="spinner-wrap">
          <div class="spinner"></div>
          <span class="spinner-text">Loading…</span>
        </div>
      </div>
    }
  `,
  styleUrl: './loading-spinner.css'
})
export class LoadingSpinnerComponent {
  loading$ = inject(LoadingService).loading$;
}
