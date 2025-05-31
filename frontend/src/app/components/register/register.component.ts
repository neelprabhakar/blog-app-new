import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card shadow-sm">
            <div class="card-header bg-white py-4">
              <h2 class="h4 text-center mb-0">Create an Account</h2>
            </div>
            <div class="card-body p-4">
              <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="name" class="form-label">Name</label>
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    formControlName="name"
                    [ngClass]="{'is-invalid': submitted && f['name'].errors}"
                    placeholder="Enter your name"
                  >
                  <div *ngIf="submitted && f['name'].errors" class="invalid-feedback">
                    <div *ngIf="f['name'].errors['required']">Name is required</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    formControlName="email"
                    [ngClass]="{'is-invalid': submitted && f['email'].errors}"
                    placeholder="Enter your email"
                  >
                  <div *ngIf="submitted && f['email'].errors" class="invalid-feedback">
                    <div *ngIf="f['email'].errors['required']">Email is required</div>
                    <div *ngIf="f['email'].errors['email']">Please enter a valid email</div>
                  </div>
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    formControlName="password"
                    [ngClass]="{'is-invalid': submitted && f['password'].errors}"
                    placeholder="Enter your password"
                  >
                  <div *ngIf="submitted && f['password'].errors" class="invalid-feedback">
                    <div *ngIf="f['password'].errors['required']">Password is required</div>
                    <div *ngIf="f['password'].errors['minlength']">Password must be at least 8 characters</div>
                  </div>
                </div>

                <div class="mb-4">
                  <label for="password_confirmation" class="form-label">Confirm Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password_confirmation"
                    formControlName="password_confirmation"
                    [ngClass]="{'is-invalid': submitted && f['password_confirmation'].errors}"
                    placeholder="Confirm your password"
                  >
                  <div *ngIf="submitted && f['password_confirmation'].errors" class="invalid-feedback">
                    <div *ngIf="f['password_confirmation'].errors['required']">Please confirm your password</div>
                    <div *ngIf="f['password_confirmation'].errors['passwordMismatch']">Passwords do not match</div>
                  </div>
                </div>

                <div *ngIf="errorMessage" class="alert alert-danger">
                  {{ errorMessage }}
                </div>

                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-primary" [disabled]="isSubmitting">
                    <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm me-2" role="status"></span>
                    Register
                  </button>
                  <button type="button" class="btn btn-outline-secondary" routerLink="/login">
                    Already have an account? Login
                  </button>
                </div>
              </form>
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
      padding: 0.75rem 1.5rem;
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
    .btn-outline-secondary {
      color: #6c757d;
      border-color: #6c757d;
      padding: 0.75rem 1.5rem;
    }
    .btn-outline-secondary:hover {
      background-color: #6c757d;
      border-color: #6c757d;
      color: #fff;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  get f() { return this.registerForm.controls; }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('password_confirmation');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.isSubmitting = true;
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      this.isSubmitting = false;
      return;
    }

    const { name, email, password, password_confirmation } = this.registerForm.value;

    this.authService.register({ name, email, password, password_confirmation }).subscribe({
      next: () => {
        this.router.navigate(['/blogs']);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        this.isSubmitting = false;
        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.error?.errors) {
          // Handle Laravel validation errors
          const errors = error.error.errors;
          this.errorMessage = Object.values(errors).flat().join('\n');
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
      }
    });
  }
} 