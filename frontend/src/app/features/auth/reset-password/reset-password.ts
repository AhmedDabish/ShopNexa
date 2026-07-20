import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

function pwMatch(g: AbstractControl): ValidationErrors | null {
  return g.get('newPassword')?.value === g.get('confirmPassword')?.value ? null : { mismatch: true };
}

@Component({ selector: 'app-reset-password', standalone: true, imports: [CommonModule, ReactiveFormsModule], templateUrl: './reset-password.html', styleUrl: './reset-password.css' })
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  token = '';
  form = this.fb.group({ newPassword: ['', [Validators.required, Validators.minLength(8)]], confirmPassword: ['', Validators.required] }, { validators: pwMatch });
  loading = false; done = false;
  ngOnInit(): void { this.token = this.route.snapshot.queryParams['token'] ?? ''; }
  get f() { return this.form.controls; }
  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.auth.resetPassword(this.token, this.form.value.newPassword!).subscribe({ next: () => { this.loading = false; this.done = true; setTimeout(() => this.router.navigate(['/auth/login']), 2000); }, error: () => { this.loading = false; } });
  }
}
