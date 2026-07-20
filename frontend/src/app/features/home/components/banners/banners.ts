import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Banner } from '../../../../core/models/order.model';

@Component({ selector: 'app-banners', standalone: true, imports: [CommonModule, RouterLink], templateUrl: './banners.html', styleUrl: './banners.css' })
export class BannersComponent {
  @Input() banners: Banner[] = [];
  get promobanners(): Banner[] { return this.banners.slice(0, 2); }
}
