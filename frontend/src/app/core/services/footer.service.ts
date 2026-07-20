import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FooterItem {
  id: number;
  section: string;
  label: string;
  url?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class FooterService {
  private http = inject(HttpClient);
  private readonly API = `${environment.apiUrl}/api/Footer`;

  // Cache the items so every page render doesn't trigger a new HTTP call.
  private _items$ = new BehaviorSubject<FooterItem[]>([]);
  items$ = this._items$.asObservable();

  // Public — used by the footer component.
  load(): Observable<FooterItem[]> {
    return this.http.get<FooterItem[]>(this.API).pipe(
      tap(items => this._items$.next(items))
    );
  }

  // Admin — list including hidden rows.
  listAll(): Observable<FooterItem[]> {
    return this.http.get<FooterItem[]>(`${this.API}/all`);
  }

  create(item: Partial<FooterItem>): Observable<any> {
    return this.http.post(this.API, item);
  }

  update(id: number, item: Partial<FooterItem>): Observable<any> {
    return this.http.put(`${this.API}/${id}`, item);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }

  // Convenience getter: pick items belonging to a single section, already sorted.
  bySection(section: string): FooterItem[] {
    return this._items$.value
      .filter(i => i.section === section && i.isActive)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }
}