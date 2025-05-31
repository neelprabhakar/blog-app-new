import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="footer bg-dark text-light py-5">
      <div class="container">
        <div class="row">
          <div class="col-md-4 mb-4 mb-md-0">
            <h5>BlogSpace</h5>
            <p class="text-muted">
              A modern platform for writers to share their ideas, connect
              with readers, and build communities around meaningful
              content.
            </p>
          </div>
          <div class="col-md-4 mb-4 mb-md-0">
            <h5>Platform</h5>
            <ul class="list-unstyled">
              <li><a routerLink="/blogs" class="text-muted text-decoration-none">All Blogs</a></li>
              <li><a href="#" class="text-muted text-decoration-none">Featured Writers</a></li>
              <li><a href="#" class="text-muted text-decoration-none">Categories</a></li>
            </ul>
          </div>
          <div class="col-md-4">
            <h5>Support</h5>
            <ul class="list-unstyled">
              <li><a href="#" class="text-muted text-decoration-none">Help Center</a></li>
              <li><a href="#" class="text-muted text-decoration-none">Contact Us</a></li>
              <li><a href="#" class="text-muted text-decoration-none">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <hr class="my-4 border-secondary">
        <div class="row">
          <div class="col text-center text-muted">
            &copy; 2024 BlogSpace. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #2c3e50 !important;
    }
    .footer h5 {
      color: #ecf0f1;
      margin-bottom: 1rem;
    }
    .footer p, .footer a {
      color: #bdc3c7 !important;
    }
    .footer a:hover {
      color: #ecf0f1 !important;
      text-decoration: underline !important;
    }
    .border-secondary {
      border-color: #34495e !important;
    }
  `]
})
export class FooterComponent {

}
