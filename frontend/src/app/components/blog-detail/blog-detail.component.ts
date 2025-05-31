import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { AuthService } from '../../services/auth.service';
import { Blog } from '../../models/blog.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div *ngIf="blog" class="card border-0 bg-light">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-start mb-4">
                <h1 class="h2 mb-0">{{ blog.title }}</h1>
                <div *ngIf="isAuthor(blog)" class="btn-group">
                  <button class="btn btn-sm btn-outline-secondary" [routerLink]="['/blogs', blog.id, 'edit']">
                    Edit
                  </button>
                  <button class="btn btn-sm btn-outline-secondary" (click)="deleteBlog()">
                    Delete
                  </button>
                </div>
              </div>

              <div class="text-muted small mb-4">
                By {{ blog.user.name }} · {{ blog.published_at | date:'mediumDate' }}
                <span *ngIf="!blog.is_published" class="badge bg-warning ms-2">Draft</span>
              </div>

              <div class="blog-content mb-4">
                {{ blog.content }}
              </div>

              <div class="d-flex justify-content-between align-items-center">
                <button class="btn btn-outline-secondary" routerLink="/blogs">
                  Back to Blogs
                </button>
                <small class="text-muted" *ngIf="!authService.isAuthenticated()">
                  <a routerLink="/login" class="text-decoration-none">Sign in</a> to write your story
                </small>
              </div>
            </div>
          </div>

          <div *ngIf="!blog && !isLoading" class="alert alert-info">
            Blog post not found.
          </div>

          <div *ngIf="isLoading" class="text-center">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .blog-content {
      color: #2c3e50;
      line-height: 1.8;
      font-size: 1.1rem;
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
    .badge {
      font-weight: normal;
    }
  `]
})
export class BlogDetailComponent implements OnInit {
  blog: Blog | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const blogId = this.route.snapshot.params['id'];
    if (blogId) {
      this.loadBlog(Number(blogId));
    }
  }

  loadBlog(id: number): void {
    this.isLoading = true;
    this.blogService.getBlog(id).subscribe({
      next: (blog: Blog) => {
        this.blog = blog;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading blog:', error);
        this.isLoading = false;
      }
    });
  }

  isAuthor(blog: Blog): boolean {
    const user = this.authService.getCurrentUser();
    return user?.id === blog.user.id;
  }

  deleteBlog(): void {
    if (this.blog && confirm('Are you sure you want to delete this blog post?')) {
      this.blogService.deleteBlog(this.blog.id).subscribe({
        next: () => {
          this.router.navigate(['/blogs']);
        },
        error: (error) => {
          console.error('Error deleting blog:', error);
        }
      });
    }
  }

  togglePublish(): void {
    if (this.blog) {
      const updatedBlog = {
        ...this.blog,
        is_published: !this.blog.is_published
      };

      this.blogService.updateBlog(this.blog.id, updatedBlog).subscribe({
        next: (blog: Blog) => {
          this.blog = blog;
        },
        error: (error) => {
          console.error('Error updating blog:', error);
        }
      });
    }
  }
} 