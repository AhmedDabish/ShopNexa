import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notify = inject(NotificationService);
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      switch (err.status) {
        case 401:
          router.navigate(['/auth/login']);
          break;
        case 403:
          notify.error('You do not have permission to perform this action.');
          break;
        case 404:
          notify.error('The requested resource was not found.');
          break;
        case 500:
          notify.error('Server error. Please try again later.');
          break;
        default:
          if (err.status !== 0) {
            notify.error(err.error?.message || 'An unexpected error occurred.');
          }
      }
      return throwError(() => err);
    })
  );
};
