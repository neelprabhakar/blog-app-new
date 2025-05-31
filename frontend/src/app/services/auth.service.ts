import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  register(userData: RegisterData): Observable<any> {
    console.log('Registration request data:', userData);
    return this.http.post(`${environment.apiUrl}/register`, userData).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(error => {
        console.error('Registration error:', error);
        console.error('Registration error details:', error.error);
        return throwError(() => error);
      })
    );
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    console.log('Login request data:', JSON.stringify(credentials));
    return this.http.post(`${environment.apiUrl}/login`, credentials).pipe(
      tap(response => this.handleAuthResponse(response)),
      catchError(error => {
        console.error('Login error:', error);
        console.error('Login error details:', error.error);
        return throwError(() => error);
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.clearAuthData();
      }),
      catchError(error => {
        console.error('Logout error:', error);
        this.clearAuthData();
        return throwError(() => error);
      })
    );
  }

  private handleAuthResponse(response: any): void {
    if (response && response.user && response.token) {
      localStorage.setItem('user', JSON.stringify(response.user));
      localStorage.setItem('token', response.token);
      this.currentUserSubject.next(response.user);
      localStorage.setItem('currentUser', JSON.stringify(response.user));
    } else {
      console.error('Invalid auth response:', response);
      throw new Error('Invalid authentication response');
    }
  }

  public clearAuthData(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }
} 