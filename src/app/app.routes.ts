// src/app/app.routes.ts - CORREGIDO SIMPLE
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
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found').then(c => c.NotFoundComponent)
  },
  { 
    path: '**', 
    redirectTo: '/404'
  }
];