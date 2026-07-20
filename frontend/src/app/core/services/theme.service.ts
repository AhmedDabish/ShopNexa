import { Injectable, signal, effect, computed } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  // Persistence rules:
  //   1. Use saved choice from localStorage if available.
  //   2. Otherwise fall back to the OS preference (prefers-color-scheme).
  //   3. Default to 'light' if neither is determinable.
  private readonly STORAGE_KEY = 'app-theme';

  private _theme = signal<Theme>(this.detectInitialTheme());
  readonly theme = this._theme.asReadonly();
  readonly isDark = computed(() => this._theme() === 'dark');

  constructor() {
    // Sync the chosen theme to <html data-theme="..."> and to localStorage.
    // Anything calling toggle()/setTheme() flows through this effect so DOM
    // and persistence stay in lockstep.
    effect(() => {
      const t = this._theme();
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', t);
      }
      try { localStorage.setItem(this.STORAGE_KEY, t); } catch { /* private mode */ }
    });
  }

  toggle(): void {
    this._theme.update(t => t === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme: Theme): void {
    this._theme.set(theme);
  }

  private detectInitialTheme(): Theme {
    if (typeof window === 'undefined') return 'light';
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY) as Theme | null;
      if (saved === 'light' || saved === 'dark') return saved;
    } catch { /* */ }

    if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  }
}