import { Routes } from '@angular/router';
import { CanDeactivateGuard } from './guards/can-deactivate.guard';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./pages/home/home').then(c => c.HomeComponent) 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login').then(c => c.LoginComponent) 
  },
  { path: 'hotels', redirectTo: '/', pathMatch: 'full' },
  
  { 
    path: 'booking/:hotelId', 
    loadComponent: () => import('./pages/booking/booking').then(c => c.BookingPageComponent),
    canDeactivate: [CanDeactivateGuard]
  },
  { 
    path: 'booking/:hotelId/:roomId', 
    loadComponent: () => import('./pages/booking/booking').then(c => c.BookingPageComponent),
    canDeactivate: [CanDeactivateGuard] 
  },
  { 
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found').then(c => c.NotFoundComponent)
  },
  { 
    path: '**', 
    redirectTo: '/404'
  }
];