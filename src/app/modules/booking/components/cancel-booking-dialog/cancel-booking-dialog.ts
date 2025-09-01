import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DateUtilsService } from '../../../../services/utils/date-utils.service';
import { UiUtilsService } from '../../../../services/utils/ui-utils.service';

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
  styleUrl: './cancel-booking-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CancelBookingDialogComponent {
  
  constructor(
    public dialogRef: MatDialogRef<CancelBookingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    
    private dateUtils: DateUtilsService,
    private uiUtils: UiUtilsService
  ) {}

 
  onCancel() {
    this.dialogRef.close('cancel');
  }

 
  onConfirm() {
    this.dialogRef.close('confirm');
  }

 
  formatDate(dateString: string): string {
    return this.dateUtils.formatDate(dateString, {
      format: 'long'
    });
  }

  getDaysMessage(): string {
    return this.dateUtils.getDaysMessage(this.data.booking.checkInDate);
  }
}