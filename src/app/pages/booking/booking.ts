// src/app/pages/booking/booking.ts - CORREGIDO SIMPLE
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';
import { BookingComponent } from '../../components/booking/booking';
import { HotelService, Hotel } from '../../services/hotel.service';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    BookingComponent,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './booking.html',
  styleUrl: './booking.scss'
})
export class BookingPageComponent implements OnInit {
  hotel: Hotel | null = null;
  hotelId: string = '';
  roomId?: string;
  loading = true;  // Cambiado de 'loading' para coincidir con template
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.hotelId = params['hotelId'];
      this.roomId = params['roomId'];
      
      if (this.hotelId) {
        this.loadHotel();
      } else {
        this.error = 'ID de hotel requerido';
        this.loading = false;
      }
    });
  }

  loadHotel() {
    this.hotelService.getHotelById(this.hotelId).subscribe({
      next: (hotel) => {
        this.hotel = hotel;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar información del hotel';
        this.loading = false;
        console.error('Error loading hotel:', error);
      }
    });
  }

  // Método que espera el template
  onBookingCompleted(bookingResponse: any) {
    console.log('Booking completed:', bookingResponse);
  }

  // Método que espera el template
  goBack() {
    this.router.navigate(['/']);
  }
}