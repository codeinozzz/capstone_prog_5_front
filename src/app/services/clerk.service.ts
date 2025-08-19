import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

declare global {
  interface Window {
    Clerk: any;
  }
}

export interface ClerkUser {
  id: string;
  firstName?: string;
  lastName?: string;
  emailAddresses: Array<{emailAddress: string}>;
  username?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClerkService {
  private clerkLoaded = new BehaviorSubject<boolean>(false);
  private currentUser = new BehaviorSubject<ClerkUser | null>(null);
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  // Observables públicos
  clerkLoaded$ = this.clerkLoaded.asObservable();
  currentUser$ = this.currentUser.asObservable();
  isAuthenticated$ = this.isAuthenticated.asObservable();

  private readonly PUBLISHABLE_KEY = 'pk_test_cG9saXNoZWQtc2hhZC0zMC5jbGVyay5hY2NvdW50cy5kZXYk';

  constructor(private router: Router) {
    this.initializeClerk();
  }

  private async initializeClerk(): Promise<void> {
    try {
      await this.waitForClerk();
      
      await window.Clerk.load({
        publishableKey: this.PUBLISHABLE_KEY
      });

      this.setupClerkListeners();
      
      this.checkAuthStatus();
      
      this.clerkLoaded.next(true);
      console.log('Clerk inicializado correctamente');
      
    } catch (error) {
      console.error('Error inicializando Clerk:', error);
    }
  }

  private waitForClerk(): Promise<void> {
    return new Promise((resolve) => {
      if (window.Clerk) {
        resolve();
        return;
      }

      const checkClerk = () => {
        if (window.Clerk) {
          resolve();
        } else {
          setTimeout(checkClerk, 100);
        }
      };
      checkClerk();
    });
  }

  private setupClerkListeners(): void {
    window.Clerk.addListener((payload: any) => {
      console.log('Clerk event:', payload);
      
      if (payload.user) {
        this.setUser(payload.user);
   
        this.router.navigate(['/']);
      } else {
        this.clearUser();
      }
    });
  }

  private checkAuthStatus(): void {
    if (window.Clerk.user) {
      this.setUser(window.Clerk.user);
    } else {
      this.clearUser();
    }
  }

  openSignIn(): void {
    if (window.Clerk) {
      window.Clerk.openSignIn({
        afterSignInUrl: '/',
        afterSignUpUrl: '/'
      });
    }
  }

  openSignUp(): void {
    if (window.Clerk) {
      window.Clerk.openSignUp({
        afterSignInUrl: '/',
        afterSignUpUrl: '/'
      });
    }
  }

  async signOut(): Promise<void> {
    if (window.Clerk) {
      await window.Clerk.signOut();
      this.clearUser();
      this.router.navigate(['/']);
    }
  }

  private setUser(user: ClerkUser): void {
    this.currentUser.next(user);
    this.isAuthenticated.next(true);
    console.log('Usuario autenticado:', user);
  }

  private clearUser(): void {
    this.currentUser.next(null);
    this.isAuthenticated.next(false);
    console.log('Usuario desautenticado');
  }

  get user(): ClerkUser | null {
    return this.currentUser.value;
  }

  get authenticated(): boolean {
    return this.isAuthenticated.value;
  }

  get loaded(): boolean {
    return this.clerkLoaded.value;
  }

  async getToken(): Promise<string | null> {
    if (window.Clerk && window.Clerk.session) {
      return await window.Clerk.session.getToken();
    }
    return null;
  }
}