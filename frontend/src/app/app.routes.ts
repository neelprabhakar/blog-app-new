import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'blogs',
    children: [
      {
        path: '',
        loadComponent: () => import('./components/blog-list/blog-list.component').then(m => m.BlogListComponent)
      },
      {
        path: 'create',
        canActivate: [authGuard],
        loadComponent: () => import('./components/blog-form/blog-form.component').then(m => m.BlogFormComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./components/blog-detail/blog-detail.component').then(m => m.BlogDetailComponent)
      },
      {
        path: ':id/edit',
        canActivate: [authGuard],
        loadComponent: () => import('./components/blog-form/blog-form.component').then(m => m.BlogFormComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
