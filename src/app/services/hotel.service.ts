// src/app/services/hotel.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Modelo actualizado para coincidir con la API
export interface Hotel {
  id: string;
  name: string;
  location: string;
  description: string;
  rating?: number;
  amenities: string[];
  createdAt: Date;
  updatedAt: Date;
  // Datos adicionales para el frontend
  image?: string;
  price?: number; // Lo calcularemos o pondremos un valor por defecto
}

// Respuesta de la API
interface ApiResponse {
  success: boolean;
  data: Hotel[];
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Obtener todos los hoteles
  getHotels(): Observable<Hotel[]> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/hotels`)
      .pipe(
        map(response => {
          if (response.success) {
            // Agregar datos de imagen y precio por defecto
            return response.data.map(hotel => ({
              ...hotel,
              image: hotel.image || this.getDefaultImage(),
              price: hotel.price || this.calculateDefaultPrice(hotel.rating || 3)
            }));
          }
          throw new Error('Error en la respuesta de la API');
        }),
        catchError(this.handleError)
      );
  }

  // Buscar hoteles por ubicación
  searchHotels(location: string): Observable<Hotel[]> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/hotels/search?location=${location}`)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data.map(hotel => ({
              ...hotel,
              image: hotel.image || this.getDefaultImage(),
              price: hotel.price || this.calculateDefaultPrice(hotel.rating || 3)
            }));
          }
          throw new Error('Error en la búsqueda');
        }),
        catchError(this.handleError)
      );
  }

  // Obtener hotel por ID
  getHotelById(id: string): Observable<Hotel> {
    return this.http.get<{success: boolean, data: Hotel}>(`${this.apiUrl}/hotels/${id}`)
      .pipe(
        map(response => {
          if (response.success) {
            return {
              ...response.data,
              image: response.data.image || this.getDefaultImage(),
              price: response.data.price || this.calculateDefaultPrice(response.data.rating || 3)
            };
          }
          throw new Error('Hotel no encontrado');
        }),
        catchError(this.handleError)
      );
  }

  // Imagen por defecto
  private getDefaultImage(): string {
    const defaultImages = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop'
    ];
    return defaultImages[Math.floor(Math.random() * defaultImages.length)];
  }

  // Calcular precio por defecto basado en rating
  private calculateDefaultPrice(rating: number): number {
    const basePrice = 80;
    return Math.floor(basePrice + (rating * 20) + Math.random() * 50);
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      switch (error.status) {
        case 0:
          errorMessage = 'No se puede conectar con el servidor. Verifica que la API esté ejecutándose.';
          break;
        case 404:
          errorMessage = 'Hoteles no encontrados';
          break;
        case 500:
          errorMessage = 'Error interno del servidor';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }
    
    console.error('Error en HotelService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}