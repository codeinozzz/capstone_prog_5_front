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
    this.clerkService.clerkLoaded$.subscribe(loaded => {
      this.clerkLoading = !loaded;
      if (loaded) {
        this.checkAuthAndRedirect();
      }
    });

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

  openSignIn(): void {
    try {
      this.clerkService.openSignIn();
    } catch (error) {
      this.handleAuthError('Error opening sign in modal');
    }
  }

  // Open sign up modal
  openSignUp(): void {
    try {
      this.clerkService.openSignUp();
    } catch (error) {
      this.handleAuthError('Error opening sign up modal');
    }
  }

  private handleLoginSuccess(): void {
    const user = this.clerkService.user;
    if (user) {
      this.snackBar.open(
        `Welcome, ${user.firstName || user.emailAddresses[0]?.emailAddress}!`,
        'Close',
        {
          duration: 3000,
          panelClass: ['success-snackbar']
        }
      );
      
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1000);
    }
  }

  private handleAuthError(message: string): void {
    this.snackBar.open(
      message,
      'Close',
      {
        duration: 5000,
        panelClass: ['error-snackbar']
      }
    );
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}