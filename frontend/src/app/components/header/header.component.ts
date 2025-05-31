import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="navbar navbar-expand-lg navbar-light">
      <div class="container">
        <a class="navbar-brand" routerLink="/">
          <span class="fw-bold">BlogSpace</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/blogs" routerLinkActive="active">Blogs</a>
            </li>
            <li class="nav-item" *ngIf="authService.isAuthenticated()">
              <a class="nav-link" routerLink="/blogs/create" routerLinkActive="active">Write</a>
            </li>
          </ul>
          <div class="d-flex align-items-center">
            <ng-container *ngIf="authService.isAuthenticated(); else authButtons">
              <span class="text-muted me-3">{{ authService.getCurrentUser()?.name }}</span>
              <button class="btn btn-sm btn-outline-secondary" (click)="logout()">Logout</button>
            </ng-container>
            <ng-template #authButtons>
              <button class="btn btn-sm btn-outline-primary me-2" routerLink="/login">Sign In</button>
              <button class="btn btn-sm btn-primary" routerLink="/register">Sign Up</button>
            </ng-template>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: #ffffff;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      padding: 1rem 0;
    }
    .navbar-brand {
      font-size: 1.5rem;
      color: #2c3e50;
    }
    .nav-link {
      color: #2c3e50;
      font-weight: 500;
      padding: 0.5rem 1rem;
    }
    .nav-link.active {
      color: #3498db;
    }
    .btn-primary {
      background-color: #3498db;
      border-color: #3498db;
    }
    .btn-primary:hover {
      background-color: #2980b9;
      border-color: #2980b9;
    }
    .btn-outline-primary {
      color: #3498db;
      border-color: #3498db;
    }
    .btn-outline-primary:hover {
      background-color: #3498db;
      border-color: #3498db;
    }
    .btn-outline-secondary {
      color: #7f8c8d;
      border-color: #7f8c8d;
    }
    .btn-outline-secondary:hover {
      background-color: #7f8c8d;
      border-color: #7f8c8d;
      color: white;
    }
  `]
})
export class HeaderComponent {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }
}
