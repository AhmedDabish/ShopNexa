import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface Crumb { label: string; url?: string; }

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="breadcrumb" aria-label="breadcrumb">
      @for (crumb of crumbs; track crumb.label; let last = $last) {
        @if (!last && crumb.url) {
          <a [routerLink]="crumb.url" class="crumb-link">{{ crumb.label }}</a>
          <span class="sep">›</span>
        } @else {
          <span class="crumb-current">{{ crumb.label }}</span>
        }
      }
    </nav>
  `,
  styleUrl: './breadcrumb.css'
})
export class BreadcrumbComponent {
  @Input() crumbs: Crumb[] = [];
}
