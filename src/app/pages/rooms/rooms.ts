// src/app/pages/rooms/rooms.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';
import { HotelService, Hotel } from '../../services/hotel.service';
import { RoomService, Room } from '../../services/room.service';

@Component({
  selector: 'app-rooms-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HeaderComponent,
    FooterComponent,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  templateUrl: './rooms.html',
  styleUrl: './rooms.scss'
})
export class RoomsPageComponent implements OnInit {
  hotel: Hotel | null = null;
  rooms: Room[] = [];
  hotelId: string = '';
  loading = true;
  roomsLoading = false;
  error: string | null = null;
  
  dateForm: FormGroup;
  minDate = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService,
    private roomService: RoomService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.dateForm = this.fb.group({
      checkIn: ['', [Validators.required]],
      checkOut: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.hotelId = params['hotelId'];
      if (this.hotelId) {
        this.loadHotel();
      } else {
        this.error = 'ID de hotel requerido';
        this.loading = false;
      }
    });

    // Cargar habitaciones cuando cambien las fechas
    this.dateForm.valueChanges.subscribe(value => {
      if (value.checkIn && value.checkOut && this.isValidDateRange()) {
        this.loadAvailableRooms();
      }
    });
  }

  loadHotel() {
    this.loading = true;
    this.hotelService.getHotelById(this.hotelId).subscribe({
      next: (hotel) => {
        this.hotel = hotel;
        this.loading = false;
        // Cargar todas las habitaciones del hotel inicialmente
        this.loadAllRooms();
      },
      error: (error) => {
        this.error = 'Error al cargar información del hotel';
        this.loading = false;
        console.error('Error loading hotel:', error);
      }
    });
  }

  loadAllRooms() {
    this.roomService.getRoomsByHotel(this.hotelId).subscribe({
      next: (rooms) => {
        this.rooms = rooms;
      },
      error: (error) => {
        console.error('Error loading rooms:', error);
        this.snackBar.open('Error cargando habitaciones', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  loadAvailableRooms() {
    if (!this.isValidDateRange()) return;

    this.roomsLoading = true;
    const checkIn = this.dateForm.value.checkIn.toISOString().split('T')[0];
    const checkOut = this.dateForm.value.checkOut.toISOString().split('T')[0];

    this.roomService.getAvailableRooms(this.hotelId, checkIn, checkOut).subscribe({
      next: (rooms) => {
        this.rooms = rooms;
        this.roomsLoading = false;
        
        if (rooms.length === 0) {
          this.snackBar.open('No hay habitaciones disponibles para estas fechas', 'Close', {
            duration: 4000
          });
        }
      },
      error: (error) => {
        this.roomsLoading = false;
        console.error('Error loading available rooms:', error);
        this.snackBar.open('Error verificando disponibilidad', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  isValidDateRange(): boolean {
    const checkIn = this.dateForm.value.checkIn;
    const checkOut = this.dateForm.value.checkOut;
    return checkIn && checkOut && checkOut > checkIn;
  }

  onReservarHabitacion(room: Room) {
    if (!this.isValidDateRange()) {
      this.snackBar.open('Selecciona fechas válidas primero', 'Close', {
        duration: 3000
      });
      return;
    }

    // Navegar a booking con roomId y fechas como query params
    this.router.navigate(['/booking/room', room.id], {
      queryParams: {
        checkIn: this.dateForm.value.checkIn.toISOString().split('T')[0],
        checkOut: this.dateForm.value.checkOut.toISOString().split('T')[0],
        hotelName: this.hotel?.name
      }
    });
  }

  goBack() {
    this.router.navigate(['/']);
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
}