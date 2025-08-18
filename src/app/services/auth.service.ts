// src/app/services/auth.service.ts - CORREGIDO
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  username?: string;
}

export interface AuthStatus {
  authenticated: boolean;
  user?: User;
}

// Interfaces para respuestas de la API - CORREGIDO
interface AuthStatusResponse {
  success: boolean;
  authenticated: boolean;
  user?: User;
}

interface UserResponse {
  success: boolean;
  data: {
    user: User;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  // Observables públicos
  currentUser$ = this.currentUserSubject.asObservable();
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuthStatus();
  }

  // Verificar estado de autenticación al cargar la app - CORREGIDO
  checkAuthStatus(): void {
    this.http.get<AuthStatusResponse>(`${this.apiUrl}/auth/status`).pipe(
      catchError(() => of({ success: true, authenticated: false }))
    ).subscribe(response => {
      // Verificación de tipos corregida
      if (response.authenticated && 'user' in response && response.user) {
        this.setUser(response.user);
      } else {
        this.clearUser();
      }
    });
  }

  // Obtener información del usuario autenticado
  getCurrentUser(): Observable<User> {
    return this.http.get<UserResponse>(`${this.apiUrl}/auth/user`).pipe(
      map(response => response.data.user),
      catchError(() => {
        this.clearUser();
        throw new Error('No autenticado');
      })
    );
  }

  // Obtener configuración de Clerk
  getClerkConfig(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/config`);
  }

  // Establecer usuario en el estado
  setUser(user: User): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    localStorage.setItem('isAuthenticated', 'true');
  }

  // Limpiar usuario del estado
  clearUser(): void {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    localStorage.removeItem('isAuthenticated');
  }

  // Logout
  logout(): void {
    this.clearUser();
    // Clerk maneja el logout automáticamente
  }

  // Verificar si está autenticado (sincrónico)
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  // Obtener usuario actual (sincrónico)
  getCurrentUserSync(): User | null {
    return this.currentUserSubject.value;
  }
}