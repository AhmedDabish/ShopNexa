import { Component, inject, OnInit, AfterViewInit, NgZone, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

// Same Google client ID as configured in Google Cloud Console.
// Must match the "Authorized JavaScript origins" entry for this site.
const GOOGLE_CLIENT_ID =
  '812877900469-a93npeojlpfhqltrjstvomudifjb74k4.apps.googleusercontent.com';

// Make the global `google` object visible to TypeScript. The actual object
// is provided by the GSI script we load in index.html.
declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit, AfterViewInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private ngZone = inject(NgZone);

  // The container the rendered Google button lives in.
  @ViewChild('googleBtn') googleBtn!: ElementRef<HTMLDivElement>;

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  loading = false;
  showPassword = false;
  errorMessage = '';

  get f() { return this.form.controls; }

  ngOnInit(): void {}

  // The GSI script registers a global `google.accounts.id` object.
  // We initialise it once the view is up and render the official Google
  // button into our placeholder div.
  ngAfterViewInit(): void {
    this.initGoogleSignIn();
  }

  private initGoogleSignIn(): void {
    // The script is `async defer`, so it might not be ready on the first
    // tick. Retry a handful of times before giving up so the user doesn't
    // see a flicker on slow networks.
    let attempts = 0;
    const tryInit = () => {
      if (typeof google !== 'undefined' && google.accounts?.id) {
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: (response: any) => this.handleGoogleCredential(response.credential),
          auto_select: false,
          cancel_on_tap_outside: true
        });

        if (this.googleBtn?.nativeElement) {
          google.accounts.id.renderButton(this.googleBtn.nativeElement, {
            theme: 'outline',
            size: 'large',
            type: 'standard',
            shape: 'rectangular',
            text: 'signin_with',
            logo_alignment: 'left',
            width: 320
          });
        }
      } else if (attempts++ < 10) {
        setTimeout(tryInit, 300);
      } else {
        console.error('Google Identity Services script failed to load.');
      }
    };
    tryInit();
  }

  // Called by the Google callback when the user picks an account.
  // We jump back into NgZone so Angular's change detection sees the result.
  private handleGoogleCredential(idToken: string): void {
    this.ngZone.run(() => {
      if (!idToken) {
        this.errorMessage = 'Google login failed: missing token.';
        return;
      }
      this.loading = true;
      this.auth.googleLogin(idToken).subscribe({
        next: (res) => {
          this.loading = false;
          this.navigateAfterLogin(res.user?.role?.name);
        },
        error: (err) => {
          this.loading = false;
          this.errorMessage = err?.error?.message || 'Google login failed. Please try again.';
        }
      });
    });
  }

  submit(): void {
    this.errorMessage = '';
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;

    this.auth.login(this.form.value).subscribe({
      next: (res) => {
        this.loading = false;
        this.navigateAfterLogin(res.user?.role?.name);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err?.error?.message || 'Invalid email or password.';
      }
    });
  }

  private navigateAfterLogin(role?: string): void {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'];
    if (returnUrl) {
      this.router.navigateByUrl(returnUrl);
    } else if (role === 'Admin') {
      this.router.navigate(['/admin']);
    } else if (role === 'Seller') {
      this.router.navigate(['/seller']);
    } else {
      this.router.navigate(['/home']);
    }
  }
}