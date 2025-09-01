// src/app/services/hotel.service.ts (refactorizado)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseApiService } from './utils/base-api.service';
import { UiUtilsService } from './utils/ui-utils.service';
import { ErrorHandlerService } from './utils/error-handler.service';

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

@Injectable({
  providedIn: 'root'
})
export class HotelService extends BaseApiService {

  constructor(
    http: HttpClient,
    errorHandler: ErrorHandlerService,
    private uiUtils: UiUtilsService
  ) {
    super(http, errorHandler);
  }

  /**
   * Obtiene todos los hoteles
   */
  getHotels(): Observable<Hotel[]> {
    return this.get<Hotel[]>('hotels').pipe(
      map(hotels => this.enrichHotelsData(hotels))
    );
  }

  /**
   * Busca hoteles por ubicación
   */
  searchHotels(location: string): Observable<Hotel[]> {
    return this.get<Hotel[]>('hotels/search', { location }).pipe(
      map(hotels => this.enrichHotelsData(hotels))
    );
  }

  /**
   * Obtiene un hotel por ID
   */
  getHotelById(id: string): Observable<Hotel> {
    return this.get<Hotel>(`hotels/${id}`).pipe(
      map(hotel => this.enrichHotelData(hotel))
    );
  }

  /**
   * Enriquece datos de múltiples hoteles
   */
  private enrichHotelsData(hotels: Hotel[]): Hotel[] {
    return hotels.map(hotel => this.enrichHotelData(hotel));
  }

  /**
   * Enriquece datos de un hotel individual
   */
  private enrichHotelData(hotel: Hotel): Hotel {
    return {
      ...hotel,
      image: hotel.image || this.uiUtils.getDefaultHotelImage(),
      price: hotel.price || this.uiUtils.calculateDefaultPrice(hotel.rating || 3)
    };
  }
}