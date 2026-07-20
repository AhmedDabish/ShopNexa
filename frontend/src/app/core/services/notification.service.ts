import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface AppNotification {
  type: NotificationType;
  message: string;
  id: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _notifications$ = new BehaviorSubject<AppNotification[]>([]);
  notifications$ = this._notifications$.asObservable();
  private nextId = 0;

  private add(type: NotificationType, message: string): void {
    const id = this.nextId++;
    const current = this._notifications$.value;
    this._notifications$.next([...current, { type, message, id }]);
    setTimeout(() => this.remove(id), 4000);
  }

  remove(id: number): void {
    this._notifications$.next(this._notifications$.value.filter(n => n.id !== id));
  }

  success(message: string): void { this.add('success', message); }
  error(message: string): void { this.add('error', message); }
  info(message: string): void { this.add('info', message); }
  warning(message: string): void { this.add('warning', message); }
}
