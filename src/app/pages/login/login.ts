// src/app/pages/login/login.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ClerkService } from '../../services/clerk.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatCardModule, 
    MatIconModule, 
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent implements OnInit {
  clerkLoading = true;
  isAuthenticated = false;

  constructor(
    private clerkService: ClerkService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Verificar si Clerk ya está cargado
    this.clerkService.clerkLoaded$.subscribe(loaded => {
      this.clerkLoading = !loaded;
      if (loaded) {
        this.checkAuthAndRedirect();
      }
    });

    // Escuchar cambios en autenticación
    this.clerkService.isAuthenticated$.subscribe(authenticated => {
      this.isAuthenticated = authenticated;
      if (authenticated) {
        this.handleLoginSuccess();
      }
    });
  }

  private checkAuthAndRedirect(): void {
    if (this.clerkService.authenticated) {
      this.router.navigate(['/']);
    }
  }

  // Abrir modal de inicio de sesión
  openSignIn(): void {
    try {
      this.clerkService.openSignIn();
    } catch (error) {
      this.handleAuthError('Error al abrir el modal de inicio de sesión');
    }
  }

  // Abrir modal de registro
  openSignUp(): void {
    try {
      this.clerkService.openSignUp();
    } catch (error) {
      this.handleAuthError('Error al abrir el modal de registro');
    }
  }

  // Manejar login exitoso
  private handleLoginSuccess(): void {
    const user = this.clerkService.user;
    if (user) {
      this.snackBar.open(
        `¡Bienvenido, ${user.firstName || user.emailAddresses[0]?.emailAddress}!`,
        'Cerrar',
        {
          duration: 3000,
          panelClass: ['success-snackbar']
        }
      );
      
      // Redireccionar a la página principal
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1000);
    }
  }

  // Manejar errores de autenticación
  private handleAuthError(message: string): void {
    this.snackBar.open(
      message,
      'Cerrar',
      {
        duration: 5000,
        panelClass: ['error-snackbar']
      }
    );
  }

  // Volver a la página principal
  goHome(): void {
    this.router.navigate(['/']);
  }
}