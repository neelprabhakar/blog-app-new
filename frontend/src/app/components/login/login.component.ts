import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow-sm">
            <div class="card-header bg-white py-4">
              <h2 class="h4 text-center mb-0">Welcome Back</h2>
            </div>
            <div class="card-body p-4">
              <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                <div class="mb-4">
                  <label for="email" class="form-label">Email</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light">
                      <i class="fas fa-envelope"></i>
                    </span>
                    <input
                      type="email"
                      class="form-control"
                      id="email"
                      formControlName="email"
                      [ngClass]="{'is-invalid': submitted && f['email'].errors}"
                      placeholder="Enter your email"
                    >
                  </div>
                  <div *ngIf="submitted && f['email'].errors" class="invalid-feedback d-block">
                    <div *ngIf="f['email'].errors['required']">Email is required</div>
                    <div *ngIf="f['email'].errors['email']">Please enter a valid email</div>
                  </div>
                </div>

                <div class="mb-4">
                  <label for="password" class="form-label">Password</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light">
                      <i class="fas fa-lock"></i>
                    </span>
                    <input
                      type="password"
                      class="form-control"
                      id="password"
                      formControlName="password"
                      [ngClass]="{'is-invalid': submitted && f['password'].errors}"
                      placeholder="Enter your password"
                    >
                  </div>
                  <div *ngIf="submitted && f['password'].errors" class="invalid-feedback d-block">
                    <div *ngIf="f['password'].errors['required']">Password is required</div>
                  </div>
                </div>

                <div *ngIf="errorMessage" class="alert alert-danger">
                  {{ errorMessage }}
                </div>

                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-primary btn-lg" [disabled]="isSubmitting">
                    <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    Sign In
                  </button>
                </div>
              </form>

              <div class="text-center mt-4">
                <p class="mb-0">Don't have an account? <a routerLink="/register" class="text-decoration-none">Sign up</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      border: none;
      border-radius: 0.5rem;
    }
    .input-group-text {
      border: 1px solid #e2e8f0;
      border-right: none;
    }
    .form-control {
      border: 1px solid #e2e8f0;
      padding: 0.75rem 1rem;
    }
    .form-control:focus {
      border-color: #3498db;
      box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25);
    }
    .btn-primary {
      background-color: #3498db;
      border-color: #3498db;
      padding: 0.75rem 1rem;
    }
    .btn-primary:hover {
      background-color: #2980b9;
      border-color: #2980b9;
    }
    .btn-primary:disabled {
      background-color: #3498db;
      border-color: #3498db;
      opacity: 0.7;
    }
    a {
      color: #3498db;
    }
    a:hover {
      color: #2980b9;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;
    this.isSubmitting = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.isSubmitting = false;
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/blogs']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.isSubmitting = false;
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Invalid email or password';
        }
      }
    });
  }
} 