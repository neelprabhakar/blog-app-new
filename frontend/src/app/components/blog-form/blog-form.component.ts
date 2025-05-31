import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BlogService } from '../../services/blog.service';
import { Blog } from '../../models/blog.model';

@Component({
  selector: 'app-blog-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card border-0 bg-light">
            <div class="card-body p-4">
              <h1 class="h3 mb-4">{{ isEditMode ? 'Edit Blog Post' : 'Write a New Blog Post' }}</h1>

              <form [formGroup]="blogForm" (ngSubmit)="onSubmit()">
                <div class="mb-4">
                  <label for="title" class="form-label">Title</label>
                  <input
                    type="text"
                    class="form-control"
                    id="title"
                    formControlName="title"
                    placeholder="Enter your blog title"
                  >
                  <div *ngIf="blogForm.get('title')?.invalid && blogForm.get('title')?.touched" class="text-danger small mt-1">
                    Title is required
                  </div>
                </div>

                <div class="mb-4">
                  <label for="content" class="form-label">Content</label>
                  <textarea
                    class="form-control"
                    id="content"
                    formControlName="content"
                    rows="10"
                    placeholder="Write your blog content here..."
                  ></textarea>
                  <div *ngIf="blogForm.get('content')?.invalid && blogForm.get('content')?.touched" class="text-danger small mt-1">
                    Content is required
                  </div>
                </div>

                <div class="mb-4">
                  <div class="form-check">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      id="is_published"
                      formControlName="is_published"
                    >
                    <label class="form-check-label" for="is_published">
                      Publish this post
                    </label>
                  </div>
                </div>

                <div class="d-flex justify-content-between align-items-center">
                  <button type="button" class="btn btn-outline-secondary" routerLink="/blogs">
                    Cancel
                  </button>
                  <button type="submit" class="btn btn-primary" [disabled]="blogForm.invalid || isSubmitting">
                    {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update Post' : 'Publish Post') }}
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
    .form-control {
      border: 1px solid #e0e0e0;
      padding: 0.75rem;
    }
    .form-control:focus {
      border-color: #3498db;
      box-shadow: 0 0 0 0.2rem rgba(52, 152, 219, 0.25);
    }
    .form-check-input:checked {
      background-color: #3498db;
      border-color: #3498db;
    }
    .btn-primary {
      background-color: #3498db;
      border-color: #3498db;
      padding: 0.5rem 1.5rem;
    }
    .btn-primary:hover {
      background-color: #2980b9;
      border-color: #2980b9;
    }
    .btn-outline-secondary {
      color: #7f8c8d;
      border-color: #7f8c8d;
      padding: 0.5rem 1.5rem;
    }
    .btn-outline-secondary:hover {
      background-color: #7f8c8d;
      border-color: #7f8c8d;
      color: white;
    }
  `]
})
export class BlogFormComponent implements OnInit {
  blogForm: FormGroup;
  isEditMode = false;
  submitted = false;
  isSubmitting = false;
  errorMessage = '';
  blogId: number | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private blogService: BlogService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.blogForm = this.formBuilder.group({
      title: ['', Validators.required],
      content: ['', Validators.required],
      is_published: [false]
    });
  }

  get f() { return this.blogForm.controls; }

  ngOnInit(): void {
    this.blogId = this.route.snapshot.params['id'];
    if (this.blogId) {
      this.isEditMode = true;
      this.loadBlog();
    }
  }

  loadBlog(): void {
    if (this.blogId) {
      this.blogService.getBlog(this.blogId).subscribe({
        next: (blog: Blog) => {
          this.blogForm.patchValue({
            title: blog.title,
            content: blog.content,
            is_published: blog.is_published
          });
        },
        error: (error) => {
          console.error('Error loading blog:', error);
          this.errorMessage = 'Error loading blog post';
        }
      });
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.isSubmitting = true;
    this.errorMessage = '';

    if (this.blogForm.invalid) {
      this.isSubmitting = false;
      return;
    }

    const blogData = this.blogForm.value;

    if (this.isEditMode && this.blogId) {
      this.blogService.updateBlog(this.blogId, blogData).subscribe({
        next: () => {
          this.router.navigate(['/blogs']);
        },
        error: (error) => {
          console.error('Error updating blog:', error);
          this.isSubmitting = false;
          this.errorMessage = 'Error updating blog post';
        }
      });
    } else {
      this.blogService.createBlog(blogData).subscribe({
        next: () => {
          this.router.navigate(['/blogs']);
        },
        error: (error) => {
          console.error('Error creating blog:', error);
          this.isSubmitting = false;
          this.errorMessage = 'Error creating blog post';
        }
      });
    }
  }

  previewBlog(): void {
    if (this.blogForm.valid) {
      const blogData = this.blogForm.value;
      const previewWindow = window.open('', '_blank');
      if (previewWindow) {
        previewWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${blogData.title} - Preview</title>
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
              <style>
                body { padding: 2rem; }
                .preview-header { margin-bottom: 2rem; }
                .preview-content { white-space: pre-wrap; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="preview-header">
                  <h1>${blogData.title}</h1>
                  <p class="text-muted">Preview Mode</p>
                </div>
                <div class="preview-content">
                  ${blogData.content}
                </div>
              </div>
            </body>
          </html>
        `);
        previewWindow.document.close();
      }
    }
  }
} 