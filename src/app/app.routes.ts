// src/app/app.routes.ts - ACTUALIZADO CON BÚSQUEDA DE HABITACIONES
import { Routes } from '@angular/router';
import { canDeactivateGuard } from './guards/can-deactivate.guard';
import { AuthGuard } from './guards/auth.guard';

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
    path: 'hotels', 
    redirectTo: '/', 
    pathMatch: 'full' 
  },

  // NUEVA: Búsqueda global de habitaciones
  { 
    path: 'search-rooms', 
    loadComponent: () => import('./pages/search-rooms/search-rooms').then(c => c.RoomsSearchPageComponent)
  },
  
  // Ver habitaciones de un hotel específico (REQUIERE AUTH)
  { 
    path: 'hotel/:hotelId/rooms', 
    loadComponent: () => import('./pages/rooms/rooms').then(c => c.RoomsPageComponent),
    canActivate: [AuthGuard]
  },
  
  // Booking con roomId
  { 
    path: 'booking/room/:roomId', 
    loadComponent: () => import('./pages/booking/booking').then(c => c.BookingComponent),
    canActivate: [AuthGuard],
    canDeactivate: [canDeactivateGuard]
  },

  // Mis reservas (REQUIERE AUTH)
  { 
    path: 'my-bookings', 
    loadComponent: () => import('./pages/my-bookings/my-bookings').then(c => c.MyBookingsComponent),
    canActivate: [AuthGuard]
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