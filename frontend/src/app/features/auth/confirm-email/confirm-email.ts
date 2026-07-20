import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({ selector: 'app-confirm-email', standalone: true, imports: [CommonModule, RouterLink], templateUrl: './confirm-email.html', styleUrl: './confirm-email.css' })
export class ConfirmEmailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  loading = true; success = false; error = '';
  ngOnInit(): void {
    const token = this.route.snapshot.queryParams['token'];
    if (!token) { this.loading = false; this.error = 'Invalid activation link'; return; }
    this.auth.confirmEmail(token).subscribe({ next: () => { this.loading = false; this.success = true; }, error: (e) => { this.loading = false; this.error = e.error?.message || 'Email activation failed'; } });
  }
}
