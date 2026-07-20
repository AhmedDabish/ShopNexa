// import { Component, inject, OnInit } from '@angular/core';
// import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { filter } from 'rxjs/operators';
// import { HeaderComponent } from './shared/components/header/header';
// import { FooterComponent } from './shared/components/footer/footer';
// import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner';
// import { NotificationComponent } from './shared/components/notification/notification';
// import { CartService } from './core/services/cart.service';
// import { WishlistService } from './core/services/wishlist.service';
// import { AuthService } from './core/services/auth.service';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, LoadingSpinnerComponent, NotificationComponent],
//   template: `
//     <app-loading-spinner />
//     <app-notification />
//     @if (!isAuthPage) {
//       <div class="site-header">
//         <app-header />
//       </div>
//       <main class="main-content">
//         <router-outlet />
//       </main>
//       <app-footer />
//     } @else {
//       <router-outlet />
//     }
//   `,
//   styles: [`
//     :host { display: block; }

//     .site-header {
//       position: fixed;
//       top: 0;
//       left: 0;
//       right: 0;
//       width: 100%;
//       z-index: 1000;
//     }

//     /*
//       top-bar  ≈ 36px
//       header   ≈ 70px
//       nav-bar  ≈ 44px
//       total    ≈ 150px
//     */
//     .main-content {
//       padding-top: 150px;
//       min-height: calc(100vh - 150px);
//     }

//     @media (max-width: 768px) {
//       /* mobile: no top-bar, header=60px, nav=44px */
//       .main-content { padding-top: 104px; }
//     }
//   `]
// })
// export class AppComponent implements OnInit {
//   private auth = inject(AuthService);
//   private cartSvc = inject(CartService);
//   private wishlistSvc = inject(WishlistService);
//   private router = inject(Router);

//   isAuthPage = true;

//   ngOnInit(): void {
//     this.router.events
//       .pipe(filter(e => e instanceof NavigationEnd))
//       .subscribe((e: any) => {
//         this.isAuthPage = e.url.startsWith('/auth') || e.url === '/';
//       });

//     if (this.auth.isLoggedIn) {
//       this.cartSvc.loadCart().subscribe();
//       this.wishlistSvc.load().subscribe();
//     }
//   }
// }
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { HeaderComponent } from './shared/components/header/header';
import { FooterComponent } from './shared/components/footer/footer';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner';
import { NotificationComponent } from './shared/components/notification/notification';
import { CartService } from './core/services/cart.service';
import { WishlistService } from './core/services/wishlist.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, LoadingSpinnerComponent, NotificationComponent],
  template: `
    <app-loading-spinner />
    <app-notification />
    @if (!isAuthPage) {
      <div class="site-header">
        <app-header />
      </div>
      <main class="main-content">
        <router-outlet />
      </main>
      <app-footer />
    } @else {
      <router-outlet />
    }
  `,
  styles: [`
    :host { display: block; }

    .site-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      z-index: 1000;
    }

    .main-content {
      padding-top: 150px;
      min-height: calc(100vh - 150px);
    }

    @media (max-width: 768px) {
      .main-content { padding-top: 104px; }
    }
  `]
})
export class AppComponent implements OnInit {
  private auth = inject(AuthService);
  private cartSvc = inject(CartService);
  private wishlistSvc = inject(WishlistService);
  private router = inject(Router);

  // Default to FALSE so the header shows on the very first paint, before any
  // navigation event fires. The previous default of `true` hid the header on
  // the home page until the router emitted its first NavigationEnd.
  isAuthPage = false;

  ngOnInit(): void {
    // Initialise from the current URL so a hard refresh on /auth/login still
    // hides the header. router.url is populated synchronously here.
    this.isAuthPage = this.checkIsAuth(this.router.url);

    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.isAuthPage = this.checkIsAuth(e.url);
      });

    if (this.auth.isLoggedIn) {
      this.cartSvc.loadCart().subscribe();
      this.wishlistSvc.load().subscribe();
    }
  }

  // Hide the chrome (header/footer) ONLY on actual auth pages.
  // The previous check included `e.url === '/'` which broke the home page
  // after we changed the root redirect from /auth/login to /home — the empty
  // moment during that redirect still satisfied url === '/' and hid the header.
  private checkIsAuth(url: string): boolean {
    return url.startsWith('/auth');
  }
}