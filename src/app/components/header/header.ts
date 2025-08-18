// src/app/components/header/header.ts - SIN MatDividerModule
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// MatDividerModule removido para evitar errores

import { ClerkService, ClerkUser } from '../../services/clerk.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule
    // MatDividerModule removido
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  currentUser: ClerkUser | null = null;
  clerkLoading = true;

  constructor(
    private clerkService: ClerkService,
    private router: Router
  ) {}

  ngOnInit() {
    // Escuchar estado de carga de Clerk
    this.clerkService.clerkLoaded$.subscribe(loaded => {
      this.clerkLoading = !loaded;
    });

    // Escuchar cambios en autenticación
    this.clerkService.isAuthenticated$.subscribe(authenticated => {
      this.isAuthenticated = authenticated;
    });

    // Escuchar cambios en el usuario
    this.clerkService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  // Navegar a home
  goHome(): void {
    this.router.navigate(['/']);
  }

  // Ir a página de login
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Abrir modal de login
  openSignIn(): void {
    this.clerkService.openSignIn();
  }

  // Cerrar sesión
  async signOut(): Promise<void> {
    try {
      await this.clerkService.signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  // Obtener nombre para mostrar
  getDisplayName(): string {
    if (!this.currentUser) return '';
    
    if (this.currentUser.firstName) {
      return this.currentUser.firstName;
    }
    
    if (this.currentUser.username) {
      return this.currentUser.username;
    }
    
    const email = this.currentUser.emailAddresses[0]?.emailAddress;
    return email ? email.split('@')[0] : 'Usuario';
  }

  // Obtener email
  getEmail(): string {
    return this.currentUser?.emailAddresses[0]?.emailAddress || '';
  }
}