// src/app/pages/booking/booking.ts - IMPORTS CORREGIDOS
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
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService
  ) {}

  ngOnInit() {
    // Obtener parámetros de la URL
    this.route.params.subscribe(params => {
      this.hotelId = params['hotelId'];
      this.roomId = params['roomId']; // Opcional
      
      if (this.hotelId) {
        this.loadHotel();
      } else {
        this.error = 'ID de hotel requerido';
        this.loading = false;
      }
    });
  }

  // Cargar información del hotel
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

  // Manejar reserva completada
  onBookingCompleted(bookingResponse: any) {
    console.log('Booking completed:', bookingResponse);
    // Aquí podrías navegar a una página de confirmación
    // this.router.navigate(['/booking-confirmation', bookingResponse.data.bookingId]);
  }

  // Volver atrás
  goBack() {
    this.router.navigate(['/']);
  }
}