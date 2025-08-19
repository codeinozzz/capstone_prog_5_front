import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CanComponentDeactivate } from '../../guards/can-deactivate.guard';
import { BookingService, BookingData } from '../../services/booking.service';

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
    MatProgressSpinnerModule
  ],
  templateUrl: './booking.html',
  styleUrl: './booking.scss'
})
export class BookingComponent implements CanComponentDeactivate {
  @Input() hotelId: string = '';
  @Input() hotelName: string = '';
  @Input() roomId?: string;
  @Output() bookingCompleted = new EventEmitter<any>();

  bookingForm: FormGroup;
  isLoading = false;
  isSuccess = false;
  confirmationNumber = '';

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private snackBar: MatSnackBar
  ) {
    this.bookingForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.bookingForm.get(fieldName);

    if (field?.hasError('required')) {
      return `${this.getFieldLabel(fieldName)} is required`;
    }

    if (field?.hasError('minlength')) {
      return `${this.getFieldLabel(fieldName)} must be at least 2 characters`;
    }

    if (field?.hasError('email')) {
      return 'Enter a valid email';
    }

    if (field?.hasError('pattern') && fieldName === 'phone') {
      return 'Enter a valid phone number';
    }

    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: any = {
      firstName: 'First Name',
      lastName: 'Last Name',
      phone: 'Phone',
      email: 'Email'
    };
    return labels[fieldName] || fieldName;
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
        roomId: this.roomId
      };

      this.bookingService.createBooking(bookingData).subscribe({
        next: (response) => {
          this.isLoading = false;

          if (response.success) {
            this.isSuccess = true;
            this.confirmationNumber = response.data?.confirmationNumber || 'N/A';

            this.snackBar.open(
              'Booking created successfully!',
              'Close',
              {
                duration: 3000,
                panelClass: ['success-snackbar']
              }
            );

            this.bookingCompleted.emit(response);
          } else {
            this.showError('Error creating booking');
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error creating booking:', error);

          let errorMessage = 'Error creating booking';
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 0) {
            errorMessage = 'Cannot connect to server';
          }

          this.showError(errorMessage);
        }
      });
    } else {
      this.bookingForm.markAllAsTouched();
      this.snackBar.open(
        'Please complete all fields correctly',
        'Close',
        { duration: 3000 }
      );
    }
  }

  private showError(message: string): void {
    this.snackBar.open(
      message,
      'Close',
      {
        duration: 5000,
        panelClass: ['error-snackbar']
      }
    );
  }

  newBooking(): void {
    this.isSuccess = false;
    this.confirmationNumber = '';
    this.bookingForm.reset();
  }

  canDeactivate(): boolean {
    if (this.isSuccess) {
      return true;
    }

    if (this.bookingForm.dirty && !this.isLoading) {
      return false;
    }

    return true;
  }
}