import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Hotel {
  id: string;
  name: string;
  location: string;
  description: string;
  rating?: number;
  amenities: string[];
  createdAt: Date;
  updatedAt: Date;
  image?: string;
  price?: number;
}

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

  getHotels(): Observable<Hotel[]> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/hotels`)
      .pipe(
        map(response => {
          if (response.success) {
            return response.data.map(hotel => ({
              ...hotel,
              image: hotel.image || this.getDefaultImage(),
              price: hotel.price || this.calculateDefaultPrice(hotel.rating || 3)
            }));
          }
          throw new Error('Error in API response');
        }),
        catchError(this.handleError)
      );
  }

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
          throw new Error('Search error');
        }),
        catchError(this.handleError)
      );
  }

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
          throw new Error('Hotel not found');
        }),
        catchError(this.handleError)
      );
  }

  private getDefaultImage(): string {
    const defaultImages = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop'
    ];
    return defaultImages[Math.floor(Math.random() * defaultImages.length)];
  }

  private calculateDefaultPrice(rating: number): number {
    const basePrice = 80;
    return Math.floor(basePrice + (rating * 20) + Math.random() * 50);
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
          errorMessage = 'Hotels not found';
          break;
        case 500:
          errorMessage = 'Internal server error';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }
    
    console.error('Error in HotelService:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}