import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({ selector: 'app-forgot-password', standalone: true, imports: [CommonModule, ReactiveFormsModule, RouterLink], templateUrl: './forgot-password.html', styleUrl: './forgot-password.css' })
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });
  loading = false; sent = false;
  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.auth.forgotPassword(this.form.value.email!).subscribe({ next: () => { this.loading = false; this.sent = true; }, error: () => { this.loading = false; this.sent = true; } });
  }
}
