import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { CanComponentDeactivate } from '../../guards/can-deactivate.guard';
import { BookingService, BookingData } from '../../services/booking.service';
import { ClerkService } from '../../services/clerk.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './booking.html',
  styleUrl: './booking.scss'
})
export class BookingComponent implements CanComponentDeactivate, OnInit {
  @Input() hotelId: string = '';
  @Input() hotelName: string = '';
  @Input() roomId?: string;
  @Output() bookingCompleted = new EventEmitter<any>();

  bookingForm: FormGroup;
  isLoading = false;
  isSuccess = false;
  confirmationNumber = '';
  
  // Fechas simples
  minDate = new Date();

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private snackBar: MatSnackBar,
    private clerkService: ClerkService
  ) {
    this.bookingForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      checkInDate: ['', [Validators.required]],
      checkOutDate: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    // SIMPLE: Si está autenticado, llenar datos básicos
    if (this.clerkService.authenticated) {
      const user = this.clerkService.user;
      if (user) {
        this.bookingForm.patchValue({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.emailAddresses[0]?.emailAddress || ''
        });
      }
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.bookingForm.get(fieldName);

    if (field?.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (field?.hasError('email')) {
      return 'Enter a valid email';
    }
    if (field?.hasError('minlength')) {
      return `Must be at least 2 characters`;
    }

    return '';
  }

  hasFieldError(fieldName: string): boolean {
    const field = this.bookingForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  onSubmit(): void {
    if (this.bookingForm.valid && !this.isLoading) {
      this.isLoading = true;

      const bookingData: BookingData = {
        ...this.bookingForm.value,
        hotelId: this.hotelId,
        roomId: this.roomId,
        checkInDate: this.bookingForm.value.checkInDate?.toISOString(),
        checkOutDate: this.bookingForm.value.checkOutDate?.toISOString()
      };

      this.bookingService.createBooking(bookingData).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.success) {
            this.isSuccess = true;
            this.confirmationNumber = response.data?.confirmationNumber || 'N/A';
            this.snackBar.open('Booking created successfully!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
            this.bookingCompleted.emit(response);
          } else {
            this.showError('Error creating booking');
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.showError(error.error?.message || 'Error creating booking');
        }
      });
    } else {
      this.bookingForm.markAllAsTouched();
    }
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  newBooking(): void {
    this.isSuccess = false;
    this.confirmationNumber = '';
    this.bookingForm.reset();
  }

  canDeactivate(): boolean {
    return this.isSuccess || !this.bookingForm.dirty || this.isLoading;
  }
}