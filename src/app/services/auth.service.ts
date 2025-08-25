// src/app/services/auth.service.ts - CORREGIDO
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, map, takeUntil } from 'rxjs/operators';

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
export class AuthService implements OnDestroy {
  private apiUrl = 'http://localhost:3000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  
  // CORREGIDO: Subject para cleanup
  private destroy$ = new Subject<void>();

  currentUser$ = this.currentUserSubject.asObservable();
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.checkAuthStatus();
  }

  // CORREGIDO: Implementar OnDestroy
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkAuthStatus(): void {
    // CORREGIDO: Usar takeUntil para cleanup
    this.http.get<AuthStatusResponse>(`${this.apiUrl}/auth/status`)
      .pipe(
        catchError(() => of({ success: true, authenticated: false })),
        takeUntil(this.destroy$)
      )
      .subscribe(response => {
        if (response.authenticated && 'user' in response && response.user) {
          this.setUser(response.user);
        } else {
          this.clearUser();
        }
      });
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<UserResponse>(`${this.apiUrl}/auth/user`).pipe(
      map(response => response.data.user),
      catchError(() => {
        this.clearUser();
        throw new Error('No autenticado');
      }),
      takeUntil(this.destroy$)
    );
  }

  getClerkConfig(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/auth/config`)
      .pipe(takeUntil(this.destroy$));
  }

  setUser(user: User): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    // CORREGIDO: Evitar localStorage si no es estrictamente necesario
    // localStorage.setItem('isAuthenticated', 'true');
  }

  clearUser(): void {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    // localStorage.removeItem('isAuthenticated');
  }

  logout(): void {
    this.clearUser();
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUserSync(): User | null {
    return this.currentUserSubject.value;
  }
}