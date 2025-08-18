// src/app/app.routes.ts - ACTUALIZADO
import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./pages/home/home').then(c => c.HomeComponent) 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./pages/login/login').then(c => c.LoginComponent) 
  },
  { 
    path: 'booking/:hotelId', 
    loadComponent: () => import('./pages/booking/booking').then(c => c.BookingPageComponent) 
  },
  { 
    path: 'booking/:hotelId/:roomId', 
    loadComponent: () => import('./pages/booking/booking').then(c => c.BookingPageComponent) 
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];