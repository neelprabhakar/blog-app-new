import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogListComponent } from '../blog-list/blog-list.component';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, BlogListComponent],
  template: `
    <div class="hero-section text-center py-5">
      <div class="container">
        <h1 class="display-4 mb-3">Share Your Ideas with the World</h1>
        <p class="lead mb-4">
          Create, publish, and share your thoughts with a global community. Join thousands of
          writers already sharing their stories.
        </p>
        <div class="d-flex justify-content-center gap-3">
          <button class="btn btn-primary btn-lg" routerLink="/blogs/create">Start Writing Today</button>
          <button class="btn btn-outline-secondary btn-lg" routerLink="/blogs">Read Stories</button>
        </div>
      </div>
    </div>

    <div class="container py-5">
      <h2 class="mb-4">Latest Stories</h2>
      <app-blog-list></app-blog-list>
    </div>

  `,
  styles: [`
    .hero-section {
      background-color: #f8f9fa;
      color: #2c3e50;
    }
    .hero-section h1 {
      font-weight: 700;
    }
    .hero-section .lead {
      color: #5a6268;
    }
    .btn-primary {
      background-color: #3498db;
      border-color: #3498db;
    }
    .btn-primary:hover {
      background-color: #2980b9;
      border-color: #2980b9;
    }
    .btn-outline-secondary {
      color: #6c757d;
      border-color: #6c757d;
    }
    .btn-outline-secondary:hover {
      background-color: #6c757d;
      border-color: #6c757d;
      color: #fff;
    }
  `]
})
export class LandingComponent implements OnInit {
  constructor(private blogService: BlogService) { }

  ngOnInit(): void {
    // BlogListComponent handles loading blogs internally
  }
}
