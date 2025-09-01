import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ClerkService, ClerkUser } from '../../services/clerk.service';
import { UiUtilsService } from '../../services/utils/ui-utils.service';
import { ErrorHandlerService } from '../../services/utils/error-handler.service';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  currentUser: ClerkUser | null = null;
  clerkLoading = true;

  constructor(
    private clerkService: ClerkService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    
    private uiUtils: UiUtilsService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.initializeClerkListeners();
  }

 
  private initializeClerkListeners(): void {
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
      this.cdr.markForCheck();
    });
  }

  
  goHome(): void {
    this.router.navigate(['/']);
  }

 
  goToLogin(): void {
    this.router.navigate(['/login']);
  }

 
  openSignIn(): void {
    try {
      this.clerkService.openSignIn();
    } catch (error) {
      this.errorHandler.handleComponentError(error, 'Opening sign in');
    }
  }

 
  async signOut(): Promise<void> {
    try {
      await this.clerkService.signOut();
      this.errorHandler.showSuccess('Signed out successfully');
    } catch (error) {
      this.errorHandler.handleComponentError(error, 'Sign out');
    }
  }

  
  getDisplayName(): string {
    return this.uiUtils.getUserDisplayName(this.currentUser);
  }

  
  getEmail(): string {
    return this.uiUtils.getUserEmail(this.currentUser);
  }
}