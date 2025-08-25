// src/app/app.routes.ts - CORREGIDO
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
  
  // Ver habitaciones (REQUIERE AUTH)
  { 
    path: 'hotel/:hotelId/rooms', 
    loadComponent: () => import('./pages/rooms/rooms').then(c => c.RoomsPageComponent),
    canActivate: [AuthGuard]
  },
  
  // CORREGIDO: Una sola ruta para booking con roomId
  { 
    path: 'booking/room/:roomId', 
    loadComponent: () => import('./pages/booking/booking').then(c => c.BookingComponent),
    canActivate: [AuthGuard],
    canDeactivate: [canDeactivateGuard]  // FUNCTIONAL GUARD
  },

  // Ruta de compatibilidad eliminada para evitar duplicados
  
  { 
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found').then(c => c.NotFoundComponent)
  },
  { 
    path: '**', 
    redirectTo: '/404'
  }
];