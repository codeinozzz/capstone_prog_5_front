import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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

import { CanComponentDeactivate } from '../../../../guards/can-deactivate.guard';
import { BookingService, BookingData } from '../../../../services/booking.service';
import { ClerkService } from '../../../../services/clerk.service';
import { FormValidatorService } from '../../../../services/utils/form-validator.service';
import { DateUtilsService } from '../../../../services/utils/date-utils.service';
import { ErrorHandlerService } from '../../../../services/utils/error-handler.service';
import { UiUtilsService } from '../../../../services/utils/ui-utils.service';

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
  styleUrl: './booking.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
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
  minDate: Date;

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService,
    private snackBar: MatSnackBar,
    private clerkService: ClerkService,
    private cdr: ChangeDetectorRef,
    private formValidator: FormValidatorService,
    private dateUtils: DateUtilsService,
    private errorHandler: ErrorHandlerService,
    private uiUtils: UiUtilsService
  ) {
    this.minDate = this.dateUtils.getMinDate();
    this.bookingForm = this.createBookingForm();
  }

  ngOnInit() {
    this.initializeUserData();
  }

  private createBookingForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      checkInDate: ['', [Validators.required]],
      checkOutDate: ['', [Validators.required]]
    });
  }

  private initializeUserData(): void {
    if (this.clerkService.authenticated) {
      const user = this.clerkService.user;
      if (user) {
        this.bookingForm.patchValue({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: this.uiUtils.getUserEmail(user)
        });
      }
    }
  }

  getFieldError(fieldName: string): string {
    return this.formValidator.getFieldError(this.bookingForm, fieldName);
  }

  hasFieldError(fieldName: string): boolean {
    return this.formValidator.hasFieldError(this.bookingForm, fieldName);
  }

  onSubmit(): void {
    if (!this.validateForm()) return;
    this.processBooking();
  }

  private validateForm(): boolean {
    if (!this.bookingForm.valid) {
      this.formValidator.markAllFieldsAsTouched(this.bookingForm);
      return false;
    }

    if (!this.isValidDateRange()) {
      this.errorHandler.showError('Please select valid check-in and check-out dates');
      return false;
    }

    return true;
  }

  private isValidDateRange(): boolean {
    const checkIn = this.bookingForm.value.checkInDate;
    const checkOut = this.bookingForm.value.checkOutDate;
    return this.formValidator.isValidDateRange(checkIn, checkOut);
  }

  private processBooking(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    const bookingData = this.buildBookingData();

    this.bookingService.createBooking(bookingData).subscribe({
      next: (response) => this.handleBookingSuccess(response),
      error: (error) => this.handleBookingError(error)
    });
  }

  private buildBookingData(): BookingData {
    const formValue = this.bookingForm.value;
    
    return {
      ...formValue,
      hotelId: this.hotelId,
      roomId: this.roomId,
      checkInDate: this.dateUtils.toISOString(formValue.checkInDate),
      checkOutDate: this.dateUtils.toISOString(formValue.checkOutDate)
    };
  }

  private handleBookingSuccess(response: any): void {
    this.isLoading = false;
    
    if (response.success) {
      this.isSuccess = true;
      this.confirmationNumber = response.data?.confirmationNumber || this.uiUtils.generateConfirmationNumber();
      this.cdr.markForCheck();
      
      this.errorHandler.showSuccess('Booking created successfully!');
      this.bookingCompleted.emit(response);
    } else {
      this.handleBookingError(new Error('Booking creation failed'));
    }
  }

  private handleBookingError(error: any): void {
    this.isLoading = false;
    this.cdr.markForCheck();
    
    const errorMessage = this.errorHandler.handleComponentError(error, 'Booking creation');
    console.error('Booking error:', errorMessage);
  }

  newBooking(): void {
    this.isSuccess = false;
    this.confirmationNumber = '';
    this.formValidator.resetForm(this.bookingForm);
    this.cdr.markForCheck();
  }

  canDeactivate(): boolean {
    return this.isSuccess || !this.bookingForm.dirty || this.isLoading;
  }
}