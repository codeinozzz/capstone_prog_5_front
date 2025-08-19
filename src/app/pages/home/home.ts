// src/app/pages/home/home.ts - CORREGIDO CON getCurrentTime
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';
import { HotelCardComponent } from '../../components/hotel-card/hotel-card';
import { SearchComponent } from '../../components/search/search';
import { HotelService, Hotel } from '../../services/hotel.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    HeaderComponent, 
    FooterComponent, 
    HotelCardComponent,
    SearchComponent,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  hotels: Hotel[] = [];
  loading = false;
  error: string | null = null;
  isSearching = false;
  searchTerm = '';

  constructor(
    private hotelService: HotelService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadHotels();
  }

  // Cargar hoteles desde la API
  loadHotels() {
    this.loading = true;
    this.error = null;

    this.hotelService.getHotels().subscribe({
      next: (hotels) => {
        this.hotels = hotels;
        this.loading = false;
        console.log('Hoteles cargados:', hotels);
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        console.error('Error cargando hoteles:', error);
        
        // Mostrar error en snackbar
        this.snackBar.open(
          'Error al cargar hoteles: ' + error.message, 
          'Cerrar', 
          {
            duration: 5000,
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

  // Reintentar cargar hoteles
  retryLoadHotels() {
    this.loadHotels();
  }

  // Manejar click en hotel - CORREGIDO
  onHotelReservado(hotel: Hotel) {
    const snackBarRef = this.snackBar.open(
      `Interesado en: ${hotel.name} - $${hotel.price}/noche`, 
      'Ver más', 
      {
        duration: 3000
      }
    );

    // Escuchar click en la acción
    snackBarRef.onAction().subscribe(() => {
      console.log('Ver más detalles de:', hotel);
      // Aquí podrías navegar a detalle del hotel
    });
  }

  // TrackBy function para mejor performance
  trackByHotelId(index: number, hotel: Hotel): string {
    return hotel.id;
  }

  // Buscar hoteles por ubicación
  onSearch(term: string) {
    this.searchTerm = term;
    this.isSearching = true;
    this.loading = true;
    this.error = null;

    this.hotelService.searchHotels(term).subscribe({
      next: (hotels) => {
        this.hotels = hotels;
        this.loading = false;
        console.log('Hoteles encontrados:', hotels);
        
        if (hotels.length === 0) {
          this.snackBar.open(
            `No se encontraron hoteles en "${term}"`, 
            'Cerrar', 
            { duration: 3000 }
          );
        }
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        console.error('Error en búsqueda:', error);
        
        this.snackBar.open(
          'Error en la búsqueda: ' + error.message, 
          'Cerrar', 
          {
            duration: 5000,
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

  // Limpiar búsqueda y volver a mostrar todos los hoteles
  onClearSearch() {
    this.searchTerm = '';
    this.isSearching = false;
    this.loadHotels();
  }

  // Método para obtener tiempo actual (para pipes)
  getCurrentTime(): Date {
    return new Date();
  }
}