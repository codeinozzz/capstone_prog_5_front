// src/app/pages/rooms-search/rooms-search.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';
import { SearchRoomsComponent } from '../../components/search-rooms/search-rooms';
import { RoomService, Room } from '../../services/room.service';

@Component({
  selector: 'app-rooms-search',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    SearchRoomsComponent,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './search-rooms.html',
  styleUrl: './search-rooms.scss'
})
export class RoomsSearchPageComponent implements OnInit {
  rooms: Room[] = [];
  loading = false;
  error: string | null = null;
  isSearching = false;
  currentFilters: any = {};

  constructor(
    private roomService: RoomService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Cargar algunas habitaciones por defecto
    this.loadDefaultRooms();
  }

  loadDefaultRooms() {
    this.loading = true;
    this.roomService.searchRooms({}).subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error cargando habitaciones';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

  onSearchRooms(filters: any) {
    if (Object.keys(filters).length === 0) {
      // Si no hay filtros, cargar todas las habitaciones
      this.loadDefaultRooms();
      this.isSearching = false;
      this.currentFilters = {};
      return;
    }

    this.loading = true;
    this.error = null;
    this.isSearching = true;
    this.currentFilters = filters;

    console.log('Buscando habitaciones con filtros:', filters);

    this.roomService.searchRooms(filters).subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        this.loading = false;
        
        if (rooms.length === 0) {
          this.snackBar.open(
            'No se encontraron habitaciones con esos criterios',
            'Cerrar',
            { duration: 3000 }
          );
        } else {
          this.snackBar.open(
            `Se encontraron ${rooms.length} habitacion(es)`,
            'Cerrar',
            { duration: 2000 }
          );
        }
      },
      error: (error) => {
        this.error = 'Error en la búsqueda';
        this.loading = false;
        console.error('Error searching rooms:', error);
        
        this.snackBar.open(
          'Error al buscar habitaciones',
          'Cerrar',
          { 
            duration: 4000,
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

  onReserveRoom(room: Room) {
    // Navegar a booking con el roomId
    this.router.navigate(['/booking/room', room.id], {
      queryParams: {
        checkIn: this.currentFilters.checkIn,
        checkOut: this.currentFilters.checkOut,
        hotelName: this.getHotelName(room)
      }
    });
  }

  getHotelName(room: Room): string {
    return room.hotel?.name || 'Hotel';
  }

  getHotelLocation(room: Room): string {
    return room.hotel?.location || 'Ubicación no disponible';
  }

  getRoomTypeLabel(type: string): string {
    const types: any = {
      'individual_1': 'Individual - 1 persona',
      'individual_2': 'Individual - 2 personas', 
      'individual_3': 'Individual - 3 personas',
      'suite_2': 'Suite - 2 personas',
      'suite_family': 'Suite Familiar'
    };
    return types[type] || type;
  }

  trackByRoomId(index: number, room: Room): string {
    return room.id;
  }
}