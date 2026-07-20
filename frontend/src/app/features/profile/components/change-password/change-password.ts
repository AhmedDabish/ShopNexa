import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { NotificationService } from '../../../../core/services/notification.service';

function pwMatch(g: AbstractControl): ValidationErrors | null {
  return g.get('newPassword')?.value === g.get('confirmPassword')?.value ? null : { mismatch: true };
}

@Component({ selector: 'app-change-password', standalone: true, imports: [CommonModule, ReactiveFormsModule], templateUrl: './change-password.html', styleUrl: './change-password.css' })
export class ChangePasswordComponent {
  private userSvc = inject(UserService);
  private notify = inject(NotificationService);
  private fb = inject(FormBuilder);
  saving = false;
  form = this.fb.group({
    oldPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  }, { validators: pwMatch });

  get f() { return this.form.controls; }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.userSvc.changePassword(this.form.value.oldPassword!, this.form.value.newPassword!).subscribe({
      next: () => { this.saving = false; this.form.reset(); this.notify.success('Password changed successfully'); },
      error: () => { this.saving = false; }
    });
  }
}
