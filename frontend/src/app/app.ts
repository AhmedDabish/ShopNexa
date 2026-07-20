import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ecommerce-frontend');

  // Inject the ThemeService here so its constructor (and the signal effect)
  // run at app startup — this is what applies the saved theme to <html>
  // before the first paint, preventing a flash of the wrong theme.
  private themeSvc = inject(ThemeService);
}