// src/app/components/booking/booking.ts - ACTUALIZADO PARA HABITACIONES
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
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
export class BookingComponent implements CanComponentDeactivate, OnInit, OnChanges {
  // CORREGIDO: Mantener hotelId si se pasa desde el template, o removerlo del template
  @Input() hotelId: string = ''; // Si necesitas hotelId, manténlo
  @Input() roomId: string = '';  // roomId es obligatorio
  @Input() hotelName: string = '';
  @Input() checkIn: string = '';
  @Input() checkOut: string = '';
  @Output() bookingCompleted = new EventEmitter<any>();
  
  bookingForm: FormGroup;
  isLoading = false;
  isSuccess = false;
  confirmationNumber = '';
  
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
    this.fillUserData();
    this.fillDates();
  }

  ngOnChanges() {
    // Si cambian los inputs, actualizar fechas
    this.fillDates();
  }

  private fillUserData() {
    // Auto-completar datos del usuario si está autenticado
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

  private fillDates() {
    // Pre-llenar fechas si vienen como parámetros
    if (this.checkIn && this.checkOut) {
      this.bookingForm.patchValue({
        checkInDate: new Date(this.checkIn),
        checkOutDate: new Date(this.checkOut)
      });
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
    if (this.bookingForm.valid && !this.isLoading && this.roomId) {
      this.isLoading = true;
      
      const bookingData: BookingData = {
        ...this.bookingForm.value,
        roomId: this.roomId,  // Enviar roomId (backend extraerá hotelId)
        hotelId: this.hotelId, // Incluir hotelId si es necesario
        checkInDate: this.bookingForm.value.checkInDate?.toISOString(),
        checkOutDate: this.bookingForm.value.checkOutDate?.toISOString()
      };

      console.log('Creating booking with data:', bookingData);

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
          console.error('Booking error:', error);
          this.showError(error.error?.message || 'Error creating booking');
        }
      });
    } else {
      if (!this.roomId) {
        this.showError('Room information missing');
      } else {
        this.bookingForm.markAllAsTouched();
        this.showError('Please complete all fields correctly');
      }
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
    this.fillUserData();
    this.fillDates();
  }

  canDeactivate(): boolean {
    return this.isSuccess || !this.bookingForm.dirty || this.isLoading;
  }
}