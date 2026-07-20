import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateFormat', standalone: true })
export class DateFormatPipe implements PipeTransform {
  transform(value: Date | string | null | undefined, format: 'short' | 'long' | 'relative' = 'short'): string {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date.getTime())) return '';

    if (format === 'relative') {
      const diff = Date.now() - date.getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);
      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      if (days === 1) return 'Yesterday';
      if (days < 7) return `${days} days ago`;
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
      ...(format === 'long' ? { hour: '2-digit', minute: '2-digit' } : {})
    });
  }
}
