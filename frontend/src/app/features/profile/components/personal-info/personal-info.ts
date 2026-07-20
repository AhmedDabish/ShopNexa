import { Component, inject, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './personal-info.html',
  styleUrl: './personal-info.css'
})
export class PersonalInfoComponent implements OnInit {
  private userSvc = inject(UserService);
  auth = inject(AuthService);
  private notify = inject(NotificationService);
  private fb = inject(FormBuilder);

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  uploading = false;
  loading = false;
  saving = false;
  user: any = null;
  form!: FormGroup;

  // Local preview shown while the upload is in flight — switches back to
  // the server URL once the request returns.
  previewUrl: string | null = null;

  ngOnInit(): void {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      phoneNumber: ['']
    });
    this.loadUserData();
  }

  private loadUserData(): void {
    this.loading = true;
    this.userSvc.getProfile().subscribe({
      next: (user: any) => {
        this.user = user;
        this.form.patchValue({
          fullName: user?.fullName,
          phoneNumber: user?.phoneNumber
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.notify.error('Failed to load user data');
      }
    });
  }

  save(): void {
    if (!this.form.valid) return;
    this.saving = true;
    const updated = { ...this.user, ...this.form.value };
    this.userSvc.updateProfile(updated).subscribe({
      next: () => {
        this.user = updated;
        this.saving = false;
        this.notify.success('Profile updated successfully');
      },
      error: () => {
        this.saving = false;
        this.notify.error('Failed to update profile');
      }
    });
  }

  // Resolves the profile image to a fully-qualified URL.
  // Returns null when the user has no picture so the template
  // falls back to the initial.
  get profileImageUrl(): string | null {
    if (this.previewUrl) return this.previewUrl;
    const img = this.auth.currentUser?.profileImage;
    if (!img) return null;
    return img.startsWith('http') ? img : `${environment.apiUrl}${img}`;
  }

  get userInitial(): string {
    return this.auth.currentUser?.fullName?.charAt(0)?.toUpperCase() ?? 'U';
  }

  openFilePicker(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    // Client-side validation matches the server: same extensions and size cap.
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      this.notify.error('Only JPG, PNG, WEBP, or GIF allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.notify.error('File too large (max 5 MB)');
      return;
    }

    // Show an immediate preview before the upload finishes.
    const reader = new FileReader();
    reader.onload = () => { this.previewUrl = reader.result as string; };
    reader.readAsDataURL(file);

    this.uploading = true;
    this.userSvc.uploadProfileImage(file).subscribe({
      next: res => {
        this.auth.updateProfileImage(res.profileImage);
        this.previewUrl = null;  // server URL takes over
        this.uploading = false;
        this.notify.success('Profile picture updated');
        input.value = '';
      },
      error: err => {
        this.previewUrl = null;
        this.uploading = false;
        this.notify.error(err?.error?.message || 'Upload failed');
        input.value = '';
      }
    });
  }

  removeImage(): void {
    if (!confirm('Remove your profile picture?')) return;
    this.uploading = true;
    this.userSvc.removeProfileImage().subscribe({
      next: () => {
        this.auth.updateProfileImage(null as any);
        this.uploading = false;
        this.notify.success('Profile picture removed');
      },
      error: () => {
        this.uploading = false;
        this.notify.error('Remove failed');
      }
    });
  }
}