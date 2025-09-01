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
import { DateUtilsService } from '../../../../services/utils/date-utils.service';
import { ErrorHandlerService } from '../../../../services/utils/error-handler.service';
import { UiUtilsService } from '../../../../services/utils/ui-utils.service';

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
    private dialog: MatDialog,
    private dateUtils: DateUtilsService,
    private errorHandler: ErrorHandlerService,
    private uiUtils: UiUtilsService
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadBookings() {
    if (!this.validateAuthentication()) return;

    this.setLoadingState(true);

    this.bookingService.getMyBookings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => this.handleBookingsSuccess(response),
        error: (error) => this.handleBookingsError(error)
      });
  }

  private validateAuthentication(): boolean {
    if (!this.clerkService.authenticated) {
      this.error = 'Authentication required';
      this.loading = false;
      return false;
    }
    return true;
  }

  private setLoadingState(loading: boolean): void {
    this.loading = loading;
    this.error = null;
  }

  private handleBookingsSuccess(response: any): void {
    this.bookings = response.data || [];
    this.loading = false;
    console.log('Bookings loaded:', this.bookings);
  }

  private handleBookingsError(error: any): void {
    this.error = this.errorHandler.handleComponentError(error, 'Loading bookings');
    this.loading = false;
  }

  onCancelBooking(booking: Booking) {
    const dialogData = this.buildCancelDialogData(booking);
    
    const dialogRef = this.dialog.open(CancelBookingDialogComponent, {
      width: '450px',
      data: dialogData
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result === 'confirm') {
          this.performCancellation(booking);
        }
      });
  }

  private buildCancelDialogData(booking: Booking) {
    const daysDiff = this.dateUtils.getDaysUntil(booking.checkInDate);
    
    return {
      booking: booking,
      canCancel: daysDiff >= 3,
      daysDiff: daysDiff
    };
  }

  private performCancellation(booking: Booking) {
    this.bookingService.cancelBooking(booking.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => this.handleCancellationSuccess(response, booking.id),
        error: (error) => this.handleCancellationError(error)
      });
  }

  private handleCancellationSuccess(response: any, bookingId: string): void {
    if (response.success) {
      this.updateBookingStatus(bookingId, 'cancelled');
      this.errorHandler.showSuccess('Booking cancelled successfully');
    }
  }

  private updateBookingStatus(bookingId: string, status: 'cancelled' | 'confirmed'): void {
    const bookingIndex = this.bookings.findIndex(b => b.id === bookingId);
    if (bookingIndex !== -1) {
      this.bookings[bookingIndex].status = status;
    }
  }

  private handleCancellationError(error: any): void {
    this.errorHandler.handleComponentError(error, 'Cancelling booking');
  }

  getStatusColor(status: string): string {
    return this.uiUtils.getStatusColor(status);
  }

  getStatusIcon(status: string): string {
    return this.uiUtils.getStatusIcon(status);
  }

  formatDate(dateString: string): string {
    return this.dateUtils.formatDate(dateString);
  }

  retryLoadBookings() {
    this.loadBookings();
  }

  trackByBookingId(index: number, booking: Booking): string {
    return booking.id;
  }
}