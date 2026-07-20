import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { ThemeService } from '../../../core/services/theme.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class HeaderComponent {
  auth = inject(AuthService);
  cartSvc = inject(CartService);
  wishlistSvc = inject(WishlistService);
  themeSvc = inject(ThemeService);
  private router = inject(Router);

  searchQuery = '';
  userMenuOpen = false;
  mobileMenuOpen = false;
  scrolled = false;

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 20;
  }

  search(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { queryParams: { q: this.searchQuery.trim() } });
      this.searchQuery = '';
      this.mobileMenuOpen = false;
    }
  }

  onSearchKey(e: KeyboardEvent): void {
    if (e.key === 'Enter') this.search();
  }

  logout(): void {
    this.userMenuOpen = false;
    this.mobileMenuOpen = false;
    this.auth.logout();
  }

  toggleTheme(): void { this.themeSvc.toggle(); }

  get cartCount(): number { return this.cartSvc.cartCount; }
  get wishlistCount(): number { return this.wishlistSvc.count; }
  get isDark(): boolean { return this.themeSvc.isDark(); }
  get userInitial(): string {
    return this.auth.currentUser?.fullName?.charAt(0)?.toUpperCase() ?? 'U';
  }

  // Resolve the user's uploaded profile picture. Stored as a relative path
  // like "/uploads/users/abc.jpg" so we prepend the API base; if no image
  // was uploaded we return null and the template falls back to the initial.
  get userImage(): string | null {
    const img = this.auth.currentUser?.profileImage;
    if (!img) return null;
    return img.startsWith('http') ? img : `${environment.apiUrl}${img}`;
  }
}