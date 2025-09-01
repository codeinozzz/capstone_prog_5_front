import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./pages/home/home').then(c => c.HomeComponent) 
  },
  
  { 
    path: 'booking', 
    loadChildren: () => import('./modules/booking/booking.module').then(m => m.BookingModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'user', 
    loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule) 
  },


  { 
    path: 'hotels', 
    redirectTo: '/', 
    pathMatch: 'full' 
  },
  { 
    path: 'search-rooms', 
    loadComponent: () => import('./pages/search-rooms/search-rooms').then(c => c.RoomsSearchPageComponent)
  },
  { 
    path: 'hotel/:hotelId/rooms', 
    loadComponent: () => import('./pages/rooms/rooms').then(c => c.RoomsPageComponent),
    canActivate: [AuthGuard]
  },
  
  { 
    path: 'login', 
    redirectTo: '/user/login',
    pathMatch: 'full'
  },
  { 
    path: 'my-bookings', 
    redirectTo: '/user/my-bookings',
    pathMatch: 'full'
  },
  { 
    path: 'booking/room/:roomId', 
    redirectTo: '/booking/room/:roomId',
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