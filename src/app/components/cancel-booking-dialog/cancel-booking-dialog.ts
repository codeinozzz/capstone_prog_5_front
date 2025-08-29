// src/app/components/cancel-booking-dialog/cancel-booking-dialog.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface DialogData {
  booking: {
    id: string;
    confirmationNumber: string;
    firstName: string;
    lastName: string;
    checkInDate: string;
    checkOutDate: string;
    hotel?: {
      name: string;
      location: string;
    };
  };
  canCancel: boolean;
  daysDiff: number;
}

@Component({
  selector: 'app-cancel-booking-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './cancel-booking-dialog.html',
  styleUrl: './cancel-booking-dialog.scss'
})
export class CancelBookingDialogComponent {
  
  constructor(
    public dialogRef: MatDialogRef<CancelBookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onCancel() {
    this.dialogRef.close('cancel');
  }

  onConfirm() {
    this.dialogRef.close('confirm');
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getDaysMessage(): string {
    const days = this.data.daysDiff;
    if (days < 0) {
      return 'Check-in date has already passed';
    } else if (days === 0) {
      return 'Check-in is today';
    } else if (days === 1) {
      return 'Check-in is tomorrow';
    } else {
      return `${days} days until check-in`;
    }
  }
}