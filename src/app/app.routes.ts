// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { CanDeactivateGuard } from './guards/can-deactivate.guard';
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
  
  // NUEVA LÓGICA: Ver habitaciones (REQUIERE AUTH)
  { 
    path: 'hotel/:hotelId/rooms', 
    loadComponent: () => import('./pages/rooms/rooms').then(c => c.RoomsPageComponent),
    canActivate: [AuthGuard]
  },
  
  // CORREGIDO: Reservar habitación específica (REQUIERE AUTH)
  { 
    path: 'booking/room/:roomId', 
    loadComponent: () => import('./pages/booking/booking').then(c => c.BookingComponent),
    canActivate: [AuthGuard],
    canDeactivate: [CanDeactivateGuard]
  },

  // MANTENER: Ruta antigua por compatibilidad (ahora redirige a rooms)
  { 
    path: 'booking/:hotelId', 
    redirectTo: 'hotel/:hotelId/rooms',
    pathMatch: 'full'
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