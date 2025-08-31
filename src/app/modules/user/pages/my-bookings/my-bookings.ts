import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';

import { HeaderComponent } from '../../../../components/header/header';
import { FooterComponent } from '../../../../components/footer/footer';
import { BookingService } from '../../../../services/booking.service';
import { ClerkService } from '../../../../services/clerk.service';
import { CancelBookingDialogComponent } from '../../../booking/components/cancel-booking-dialog/cancel-booking-dialog';

interface Booking {
  id: string;
  confirmationNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  hotelId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
  hotel?: {
    id: string;
    name: string;
    location: string;
  };
}

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSnackBarModule
  ],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.scss'
})
export class MyBookingsComponent implements OnInit, OnDestroy {
  bookings: Booking[] = [];
  loading = true;
  error: string | null = null;
  
  private destroy$ = new Subject<void>();

  constructor(
    private bookingService: BookingService,
    private clerkService: ClerkService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadBookings() {
    if (!this.clerkService.authenticated) {
      this.error = 'Authentication required';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.error = null;

    this.bookingService.getMyBookings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.bookings = response.data || [];
          this.loading = false;
          console.log('Bookings loaded:', this.bookings);
        },
        error: (error) => {
          this.error = error.message || 'Error loading bookings';
          this.loading = false;
          console.error('Error loading bookings:', error);
          
          this.snackBar.open(
            'Error loading bookings: ' + error.message,
            'Close',
            {
              duration: 5000,
              panelClass: ['error-snackbar']
            }
          );
        }
      });
  }

  onCancelBooking(booking: Booking) {
    const checkInDate = new Date(booking.checkInDate);
    const now = new Date();
    const daysDiff = Math.ceil((checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    const dialogRef = this.dialog.open(CancelBookingDialogComponent, {
      width: '450px',
      data: {
        booking: booking,
        canCancel: daysDiff >= 3,
        daysDiff: daysDiff
      }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result === 'confirm') {
          this.performCancellation(booking);
        }
      });
  }

  private performCancellation(booking: Booking) {
    this.bookingService.cancelBooking(booking.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success) {
            const bookingIndex = this.bookings.findIndex(b => b.id === booking.id);
            if (bookingIndex !== -1) {
              this.bookings[bookingIndex].status = 'cancelled';
            }
            
            this.snackBar.open(
              'Booking cancelled successfully',
              'Close',
              {
                duration: 3000,
                panelClass: ['success-snackbar']
              }
            );
          }
        },
        error: (error) => {
          console.error('Error cancelling booking:', error);
          
          let errorMessage = 'Error cancelling booking';
          if (error.error?.message) {
            errorMessage = error.error.message;
          }
          
          this.snackBar.open(
            errorMessage,
            'Close',
            {
              duration: 5000,
              panelClass: ['error-snackbar']
            }
          );
        }
      });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'primary';
      case 'cancelled':
        return 'warn';
      default:
        return '';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'check_circle';
      case 'cancelled':
        return 'cancel';
      default:
        return 'help';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  retryLoadBookings() {
    this.loadBookings();
  }
}