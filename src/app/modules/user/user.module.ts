import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Routing
import { UserRoutingModule } from './user-routing.module';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }