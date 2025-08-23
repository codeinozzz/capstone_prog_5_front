// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ClerkService } from '../services/clerk.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private clerkService: ClerkService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | boolean {
    
    // Si Clerk no ha cargado, esperar
    if (!this.clerkService.loaded) {
      return this.clerkService.clerkLoaded$.pipe(
        take(1),
        map(loaded => {
          if (loaded && this.clerkService.authenticated) {
            return true;
          } else {
            this.redirectToLogin(state.url);
            return false;
          }
        })
      );
    }

    // Si ya cargó, verificar directamente
    if (this.clerkService.authenticated) {
      return true;
    } else {
      this.redirectToLogin(state.url);
      return false;
    }
  }

  private redirectToLogin(returnUrl: string): void {
    console.log('Auth required, redirecting to login...');
    this.router.navigate(['/login'], { 
      queryParams: { returnUrl: returnUrl } 
    });
  }
}