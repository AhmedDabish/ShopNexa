import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, AppNotification } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications">
      @for (n of (notifications$ | async); track n.id) {
        <div class="toast" [class]="n.type">
          <span class="toast-icon">{{ getIcon(n.type) }}</span>
          <span class="toast-msg">{{ n.message }}</span>
          <button class="toast-close" (click)="remove(n.id)">×</button>
        </div>
      }
    </div>
  `,
  styleUrl: './notification.css'
})
export class NotificationComponent {
  private svc = inject(NotificationService);
  notifications$ = this.svc.notifications$;
  remove(id: number): void { this.svc.remove(id); }
  getIcon(type: string): string {
    return { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' }[type] ?? 'ℹ️';
  }
}
