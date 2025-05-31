import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { Blog, BlogResponse } from '../../models/blog.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-5">
      <div class="row mb-4">
        <div class="col">
          <h1 class="h3 mb-2">Blog Posts</h1>
          <p class="text-muted">Discover stories, thinking, and expertise from writers on any topic.</p>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-8">
          <div *ngIf="blogs.length === 0" class="alert alert-light">
            No blog posts found.
          </div>

          <div *ngFor="let blog of blogs" class="card mb-4 border-0 bg-light">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <h2 class="h4 mb-0">
                  <a [routerLink]="['/blogs', blog.id]" class="text-decoration-none text-dark">
                    {{ blog.title }}
                  </a>
                </h2>
                <div *ngIf="isAuthor(blog)" class="btn-group">
                  <button class="btn btn-sm btn-outline-secondary" [routerLink]="['/blogs', blog.id, 'edit']">
                    Edit
                  </button>
                  <button class="btn btn-sm btn-outline-secondary" (click)="deleteBlog(blog)">
                    Delete
                  </button>
                </div>
              </div>

              <p class="text-muted small mb-3">
                By {{ blog.user.name }} · {{ blog.published_at | date:'mediumDate' }}
                <span *ngIf="!blog.is_published" class="badge bg-warning ms-2">Draft</span>
              </p>

              <p class="card-text text-muted mb-3">
                {{ blog.content | slice:0:200 }}...
              </p>

              <div class="d-flex justify-content-between align-items-center">
                <a [routerLink]="['/blogs', blog.id]" class="btn btn-link text-primary p-0">
                  Read more
                </a>
                <small class="text-muted" *ngIf="!authService.isAuthenticated()">
                  <a routerLink="/login" class="text-decoration-none">Sign in</a> to write your story
                </small>
              </div>
            </div>
          </div>

          <nav *ngIf="totalPages > 1" aria-label="Blog pagination">
            <ul class="pagination justify-content-center">
              <li class="page-item" [class.disabled]="currentPage === 1">
                <a class="page-link border-0" (click)="changePage(currentPage - 1)" href="javascript:void(0)">
                  Previous
                </a>
              </li>
              <li class="page-item" *ngFor="let page of pages" [class.active]="page === currentPage">
                <a class="page-link border-0" (click)="changePage(page)" href="javascript:void(0)">
                  {{ page }}
                </a>
              </li>
              <li class="page-item" [class.disabled]="currentPage === totalPages">
                <a class="page-link border-0" (click)="changePage(currentPage + 1)" href="javascript:void(0)">
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      transition: transform 0.2s;
    }
    .card:hover {
      transform: translateY(-2px);
    }
    .card-title a {
      color: #2c3e50;
    }
    .card-title a:hover {
      color: #3498db;
    }
    .pagination {
      margin-top: 2rem;
    }
    .page-link {
      color: #2c3e50;
      padding: 0.5rem 1rem;
      margin: 0 0.2rem;
      border-radius: 4px;
    }
    .page-item.active .page-link {
      background-color: #3498db;
      color: white;
    }
    .btn-link {
      text-decoration: none;
    }
    .btn-link:hover {
      text-decoration: underline;
    }
    .badge {
      font-weight: normal;
    }
  `]
})
export class BlogListComponent implements OnInit {
  blogs: Blog[] = [];
  currentPage = 1;
  totalPages = 1;
  pages: number[] = [];

  constructor(
    private blogService: BlogService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.blogService.getBlogs(this.currentPage).subscribe({
      next: (response: BlogResponse) => {
        this.blogs = response.data;
        this.totalPages = response.last_page;
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      },
      error: (error) => {
        console.error('Error loading blogs:', error);
      }
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadBlogs();
    }
  }

  isAuthor(blog: Blog): boolean {
    const currentUser = this.authService.getCurrentUser();
    return currentUser?.id === blog.user.id;
  }

  deleteBlog(blog: Blog): void {
    if (confirm('Are you sure you want to delete this blog post?')) {
      this.blogService.deleteBlog(blog.id).subscribe({
        next: () => {
          this.loadBlogs();
        },
        error: (error) => {
          console.error('Error deleting blog:', error);
        }
      });
    }
  }
} 