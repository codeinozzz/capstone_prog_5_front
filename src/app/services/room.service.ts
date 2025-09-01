// src/app/services/room.service.ts (refactorizado)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseApiService } from './utils/base-api.service';
import { ErrorHandlerService } from './utils/error-handler.service';

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
  hotel?: {
    id: string;
    name: string;
    location: string;
    rating?: number;
  };
}

export interface RoomSearchFilters {
  numberOfPeople?: number;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  checkIn?: string;
  checkOut?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RoomService extends BaseApiService {

  constructor(
    http: HttpClient,
    errorHandler: ErrorHandlerService
  ) {
    super(http, errorHandler);
  }

  /**
   * Obtiene habitaciones por hotel
   */
  getRoomsByHotel(hotelId: string): Observable<Room[]> {
    return this.get<Room[]>(`rooms/hotel/${hotelId}`);
  }

  /**
   * Obtiene habitaciones disponibles para fechas específicas
   */
  getAvailableRooms(hotelId: string, checkIn: string, checkOut: string): Observable<Room[]> {
    const params = {
      hotelId,
      checkIn,
      checkOut
    };
    return this.get<Room[]>('rooms/available', params);
  }

  /**
   * Obtiene una habitación por ID
   */
  getRoomById(id: string): Observable<Room> {
    return this.get<Room>(`rooms/${id}`);
  }

  /**
   * Busca habitaciones con filtros
   */
  searchRooms(filters: RoomSearchFilters): Observable<Room[]> {
    const cleanFilters = this.cleanSearchFilters(filters);
    return this.get<Room[]>('rooms/search', cleanFilters);
  }

  /**
   * Limpia filtros de búsqueda removiendo valores vacíos
   */
  private cleanSearchFilters(filters: RoomSearchFilters): RoomSearchFilters {
    const cleaned: RoomSearchFilters = {};
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        cleaned[key as keyof RoomSearchFilters] = value;
      }
    });
    
    return cleaned;
  }

  /**
   * Verifica si hay habitaciones disponibles para un hotel en fechas específicas
   */
  checkAvailability(hotelId: string, checkIn: string, checkOut: string): Observable<boolean> {
    return this.getAvailableRooms(hotelId, checkIn, checkOut).pipe(
      map(rooms => rooms.length > 0)
    );
  }

  /**
   * Obtiene capacidades de habitación disponibles
   */
  getRoomCapacities(): Array<{value: number, label: string}> {
    return [
      { value: 1, label: '1 person' },
      { value: 2, label: '2 people' },
      { value: 3, label: '3 people' },
      { value: 4, label: '4 people' }
    ];
  }
}