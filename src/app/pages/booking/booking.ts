import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subject, takeUntil } from 'rxjs';

import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';
import { BookingComponent as BookingFormComponent } from '../../components/booking/booking';
import { HotelService, Hotel } from '../../services/hotel.service';
import { RoomService, Room } from '../../services/room.service';

@Component({
  selector: 'app-booking-page',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    BookingFormComponent,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './booking.html',
  styleUrl: './booking.scss'
})
export class BookingComponent implements OnInit, OnDestroy {
  hotelId: string = '';
  roomId: string = '';
  hotel: Hotel | null = null;
  room: Room | null = null;
  loading = true;
  error: string | null = null;
  checkIn: string = '';
  checkOut: string = '';
  hotelName: string = '';

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService,
    private roomService: RoomService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.roomId = params['roomId'];
        if (this.roomId) {
          this.loadRoomData();
        } else {
          this.error = 'Room ID is required';
          this.loading = false;
        }
      });

    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.checkIn = params['checkIn'] || '';
        this.checkOut = params['checkOut'] || '';
        this.hotelName = params['hotelName'] || '';
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadRoomData() {
    this.loading = true;
    this.error = null;

    this.roomService.getRoomById(this.roomId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (room) => {
          this.room = room;
          this.hotelId = room.hotelId;
          this.loadHotelData();
        },
        error: (error) => {
          this.error = 'Error loading room information';
          this.loading = false;
          console.error('Error loading room:', error);
          
          this.snackBar.open(
            'Error loading room: ' + error.message,
            'Close',
            {
              duration: 5000,
              panelClass: ['error-snackbar']
            }
          );
        }
      });
  }

  loadHotelData() {
    if (!this.hotelId) {
      this.loading = false;
      return;
    }

    this.hotelService.getHotelById(this.hotelId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (hotel) => {
          this.hotel = hotel;
          this.hotelName = this.hotelName || hotel.name;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error loading hotel information';
          this.loading = false;
          console.error('Error loading hotel:', error);
        }
      });
  }

  onBookingCompleted(event: any) {
    console.log('Booking completed:', event);
    this.snackBar.open(
      'Booking completed successfully!',
      'Close',
      {
        duration: 3000,
        panelClass: ['success-snackbar']
      }
    );
  }

  goBack() {
    if (this.hotelId) {
      this.router.navigate(['/hotel', this.hotelId, 'rooms']);
    } else {
      this.router.navigate(['/']);
    }
  }
}