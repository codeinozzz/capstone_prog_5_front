// src/app/services/room.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Room {
  id: string;
  hotelId: string;
  type: string;
  capacity: number;
  beds?: string;
  price: number;
  available: boolean;
  amenities: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface RoomApiResponse {
  success: boolean;
  data: Room[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Obtener habitaciones por hotel
  getRoomsByHotel(hotelId: string): Observable<Room[]> {
    return this.http.get<RoomApiResponse>(`${this.apiUrl}/rooms/hotel/${hotelId}`)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          }
          throw new Error('Error loading rooms');
        }),
        catchError(this.handleError)
      );
  }

  // NUEVO: Obtener habitaciones disponibles por fechas
  getAvailableRooms(hotelId: string, checkIn: string, checkOut: string): Observable<Room[]> {
    const params = new URLSearchParams({
      hotelId: hotelId,
      checkIn: checkIn,
      checkOut: checkOut
    });

    return this.http.get<RoomApiResponse>(`${this.apiUrl}/rooms/available?${params.toString()}`)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          }
          throw new Error('Error checking availability');
        }),
        catchError(this.handleError)
      );
  }

  // Obtener habitación por ID
  getRoomById(id: string): Observable<Room> {
    return this.http.get<{success: boolean, data: Room}>(`${this.apiUrl}/rooms/${id}`)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          }
          throw new Error('Room not found');
        }),
        catchError(this.handleError)
      );
  }

  // Buscar habitaciones con filtros
  searchRooms(filters: {
    numberOfPeople?: number;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
  }): Observable<Room[]> {
    const params = new URLSearchParams();
    
    if (filters.numberOfPeople) {
      params.append('numberOfPeople', filters.numberOfPeople.toString());
    }
    if (filters.type) {
      params.append('type', filters.type);
    }
    if (filters.minPrice) {
      params.append('minPrice', filters.minPrice.toString());
    }
    if (filters.maxPrice) {
      params.append('maxPrice', filters.maxPrice.toString());
    }
    if (filters.location) {
      params.append('location', filters.location);
    }

    return this.http.get<RoomApiResponse>(`${this.apiUrl}/rooms/search?${params.toString()}`)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data;
          }
          throw new Error('Search error');
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 0:
          errorMessage = 'Cannot connect to server. Check that the API is running.';
          break;
        case 404:
          errorMessage = 'Rooms not found';
          break;
        case 500:
          errorMessage = 'Internal server error';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }
    
    console.error('Error in RoomService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}