import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing
import { BookingRoutingModule } from './booking-routing.module';

@NgModule({
  imports: [
    CommonModule,
    BookingRoutingModule
  ]
})
export class BookingModule { }