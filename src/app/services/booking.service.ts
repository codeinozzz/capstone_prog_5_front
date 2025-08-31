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
  checkInDate: string;
  checkOutDate: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data?: {
    bookingId: string;
    confirmationNumber: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  createBooking(bookingData: BookingData): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${this.apiUrl}/bookings`, bookingData).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error creating booking:', error);
        throw error;
      })
    );
  }

  getMyBookings(): Observable<{ success: boolean; data: any[]; total: number }> {
    return this.http.get<{ success: boolean; data: any[]; total: number }>(`${this.apiUrl}/bookings/my`).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error fetching bookings:', error);
        throw error;
      })
    );
  }

  cancelBooking(bookingId: string): Observable<{ success: boolean; message: string }> {
    return this.http.put<{ success: boolean; message: string }>(`${this.apiUrl}/bookings/${bookingId}/cancel`, {}).pipe(
      map(response => response),
      catchError(error => {
        console.error('Error cancelling booking:', error);
        throw error;
      })
    );
  }
}