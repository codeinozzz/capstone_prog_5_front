// src/app/components/search-rooms/search-rooms.ts
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-search-rooms',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './search-rooms.html',
  styleUrl: './search-rooms.scss'
})
export class SearchRoomsComponent {
  @Output() searchRooms = new EventEmitter<any>();

  searchForm: FormGroup;
  minDate = new Date();

  roomCapacities = [
    { value: 1, label: '1 persona' },
    { value: 2, label: '2 personas' },
    { value: 3, label: '3 personas' },
    { value: 4, label: '4 personas' }
  ];

  constructor(private fb: FormBuilder) {
    this.searchForm = this.fb.group({
      numberOfPeople: [''],
      checkIn: [''],
      checkOut: [''],
      location: ['']
    });
  }

  onSearch() {
    if (this.searchForm.valid) {
      const filters = this.searchForm.value;
      
      // Convertir fechas a string si existen
      if (filters.checkIn) {
        filters.checkIn = filters.checkIn.toISOString().split('T')[0];
      }
      if (filters.checkOut) {
        filters.checkOut = filters.checkOut.toISOString().split('T')[0];
      }

      this.searchRooms.emit(filters);
    }
  }

  onClear() {
    this.searchForm.reset();
    this.searchRooms.emit({});
  }

  isValidDateRange(): boolean {
    const checkIn = this.searchForm.value.checkIn;
    const checkOut = this.searchForm.value.checkOut;
    return checkIn && checkOut && checkOut > checkIn;
  }
}