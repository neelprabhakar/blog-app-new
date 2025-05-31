# Blog Application

A full-stack blog application built with Angular and Laravel.

## Features

- User authentication (register/login)
- Create, read, update, and delete blog posts
- Responsive design for both desktop and mobile
- Pagination for blog listing
- Protected routes for authenticated users
- RESTful API architecture

## Prerequisites

- PHP 8.1 or higher
- Composer
- Node.js 14 or higher
- Angular CLI
- MySQL or any other database supported by Laravel

## Backend Setup (Laravel)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

4. Generate application key:
   ```bash
   php artisan key:generate
   ```

5. Configure your database in the `.env` file:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=blogapp
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

6. Run database migrations:
   ```bash
   php artisan migrate
   ```

7. Start the Laravel development server:
   ```bash
   php artisan serve
   ```

## Frontend Setup (Angular)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the Angular development server:
   ```bash
   ng serve
   ```

## Accessing the Application

- Backend API: http://localhost:8000
- Frontend Application: http://localhost:4200

## API Endpoints

- POST /api/register - Register a new user
- POST /api/login - Login user
- POST /api/logout - Logout user
- GET /api/blogs - Get all blogs (paginated)
- GET /api/blogs/{id} - Get a specific blog
- POST /api/blogs - Create a new blog (authenticated)
- PUT /api/blogs/{id} - Update a blog (authenticated)
- DELETE /api/blogs/{id} - Delete a blog (authenticated)

## Security

- All API endpoints except login and register require authentication
- Blog creation, editing, and deletion are restricted to authenticated users
- Blog viewing is available to all users
- Passwords are hashed using Laravel's built-in hashing
- CSRF protection is enabled
- API authentication is handled using Laravel Sanctum 