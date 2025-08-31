import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canDeactivateGuard } from '../../guards/can-deactivate.guard';

const routes: Routes = [
  {
    path: 'room/:roomId',
    loadComponent: () => import('./pages/booking/booking').then(c => c.BookingComponent),
    canDeactivate: [canDeactivateGuard]
  },
  {
    path: '',
    redirectTo: '/hotels',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule { }