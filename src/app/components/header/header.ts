import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ClerkService, ClerkUser } from '../../services/clerk.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush  // OnPush - requires manual checks for observables
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  currentUser: ClerkUser | null = null;
  clerkLoading = true;

  constructor(
    private clerkService: ClerkService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.clerkService.clerkLoaded$.subscribe(loaded => {
      this.clerkLoading = !loaded;
      this.cdr.markForCheck();
    });

    this.clerkService.isAuthenticated$.subscribe(authenticated => {
      this.isAuthenticated = authenticated;
      this.cdr.markForCheck();
    });

    this.clerkService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.cdr.markForCheck(); // Force detection when user changes
    });
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  openSignIn(): void {
    this.clerkService.openSignIn();
  }

  async signOut(): Promise<void> {
    try {
      await this.clerkService.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  getDisplayName(): string {
    if (!this.currentUser) return '';
    
    if (this.currentUser.firstName) {
      return this.currentUser.firstName;
    }
    
    if (this.currentUser.username) {
      return this.currentUser.username;
    }
    
    const email = this.currentUser.emailAddresses[0]?.emailAddress;
    return email ? email.split('@')[0] : 'User';
  }

  getEmail(): string {
    return this.currentUser?.emailAddresses[0]?.emailAddress || '';
  }
}
