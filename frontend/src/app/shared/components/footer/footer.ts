// import { Component } from '@angular/core';
// import { RouterLink } from '@angular/router';

// @Component({
//   selector: 'app-footer',
//   standalone: true,
//   imports: [RouterLink],
//   templateUrl: './footer.html',
//   styleUrl: './footer.css'
// })
// export class FooterComponent {
//   year = new Date().getFullYear();
// }
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FooterService, FooterItem } from '../../../core/services/footer.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class FooterComponent implements OnInit, OnDestroy {
  private footerSvc = inject(FooterService);
  private destroy$ = new Subject<void>();

  year = new Date().getFullYear();
  items: FooterItem[] = [];

  ngOnInit(): void {
    this.footerSvc.load()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: items => this.items = items,
        error: () => { /* show fallback empty footer rather than crash */ }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Filter helpers — sections are rendered via @for in the template.
  section(name: string): FooterItem[] {
    return this.items
      .filter(i => i.section === name && i.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  // Brand description is stored as the single 'brand' item without a URL.
  get brandDesc(): string {
    return this.section('brand').find(i => !i.url)?.label ?? '';
  }

  // External URLs (http/https) should open with <a href>, internal with routerLink.
  isExternal(url?: string): boolean {
    return !!url && (url.startsWith('http://') || url.startsWith('https://') || url === '#');
  }
}