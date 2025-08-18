// src/app/services/booking.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface BookingData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  hotelId: string;
  roomId?: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data?: {
    bookingId: string;
    confirmationNumber: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Crear nueva reserva
  createBooking(bookingData: BookingData): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${this.apiUrl}/bookings`, bookingData).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error creating booking:', error);
        throw error;
      })
    );
  }
}