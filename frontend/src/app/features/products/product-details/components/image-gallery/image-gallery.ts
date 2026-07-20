import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductImage } from '../../../../../core/models/product.model';

@Component({ selector: 'app-image-gallery', standalone: true, imports: [CommonModule], templateUrl: './image-gallery.html', styleUrl: './image-gallery.css' })
export class ImageGalleryComponent {
  @Input() images: ProductImage[] = [];
  activeIndex = 0;
  zoomed = false;
  get main(): string { return this.images[this.activeIndex]?.imageUrl ?? 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-midnight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1708368468043'; }
}
