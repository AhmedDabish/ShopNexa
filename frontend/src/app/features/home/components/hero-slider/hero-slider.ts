import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Banner } from '../../../../core/models/order.model';

@Component({
  selector: 'app-hero-slider',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './hero-slider.html',
  styleUrl: './hero-slider.css'
})
export class HeroSliderComponent implements OnInit, OnDestroy {
  @Input() banners: Banner[] = [];
  current = 0;
  private timer?: ReturnType<typeof setInterval>;

  get activeBanners(): Banner[] {
    return this.banners.length ? this.banners : [
      {
        id: 1, title: 'Discover Amazing Products',
        description: 'Shop the latest trends with unbeatable prices and fast delivery right to your door.',
        imageUrl: '', linkUrl: '/products',
        displayOrder: 0, isActive: true, startDate: new Date(), endDate: new Date()
      },
      {
        id: 2, title: 'New Season, New Deals',
        description: 'Explore thousands of products across all categories — electronics, fashion, home & more.',
        imageUrl: '', linkUrl: '/products',
        displayOrder: 1, isActive: true, startDate: new Date(), endDate: new Date()
      }
    ];
  }

  ngOnInit(): void { this.timer = setInterval(() => this.next(), 6000); }
  ngOnDestroy(): void { clearInterval(this.timer); }
  next(): void { this.current = (this.current + 1) % this.activeBanners.length; }
  prev(): void { this.current = (this.current - 1 + this.activeBanners.length) % this.activeBanners.length; }
  goTo(i: number): void { this.current = i; clearInterval(this.timer); this.timer = setInterval(() => this.next(), 6000); }
}
