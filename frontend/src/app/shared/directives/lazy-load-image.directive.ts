import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

@Directive({ selector: '[appLazyLoadImage]', standalone: true })
export class LazyLoadImageDirective implements OnInit, OnDestroy {
  @Input() appLazyLoadImage!: string;
  @Input() placeholder = 'images/placeholder.png';
  private observer?: IntersectionObserver;

  constructor(private el: ElementRef<HTMLImageElement>) {}

  ngOnInit(): void {
    const img = this.el.nativeElement;
    img.src = this.placeholder;
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        img.src = this.appLazyLoadImage;
        img.onerror = () => { img.src = this.placeholder; };
        this.observer?.disconnect();
      }
    }, { rootMargin: '100px' });
    this.observer.observe(img);
  }

  ngOnDestroy(): void { this.observer?.disconnect(); }
}
