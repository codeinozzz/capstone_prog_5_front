// src/app/services/utils/base-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ErrorHandlerService } from './error-handler.service';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
}

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  protected readonly apiUrl = 'http://localhost:3000/api';

  constructor(
    protected http: HttpClient,
    protected errorHandler: ErrorHandlerService
  ) {}

  protected get<T>(endpoint: string, params?: any): Observable<T> {
    const httpParams = this.buildHttpParams(params);
    
    return this.http.get<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, { params: httpParams })
      .pipe(
        map(response => this.extractData(response)),
        catchError(error => this.errorHandler.handleHttpError(error))
      );
  }


  protected post<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, data)
      .pipe(
        map(response => this.extractData(response)),
        catchError(error => this.errorHandler.handleHttpError(error))
      );
  }


  protected put<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`, data)
      .pipe(
        map(response => this.extractData(response)),
        catchError(error => this.errorHandler.handleHttpError(error))
      );
  }


  protected delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<ApiResponse<T>>(`${this.apiUrl}/${endpoint}`)
      .pipe(
        map(response => this.extractData(response)),
        catchError(error => this.errorHandler.handleHttpError(error))
      );
  }


  private buildHttpParams(params?: any): HttpParams {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== null && value !== undefined && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }
    
    return httpParams;
  }


  private extractData<T>(response: ApiResponse<T>): T {
    if (response.success) {
      return response.data;
    }
    throw new Error(response.message || 'API request failed');
  }

 
  protected handleApiResponse<T>(response: ApiResponse<T>): ApiResponse<T> {
    if (response.success) {
      return response;
    }
    throw new Error(response.message || 'API request failed');
  }

  protected getFullUrl(endpoint: string): string {
    return `${this.apiUrl}/${endpoint}`;
  }


  protected extractArrayData<T>(response: ApiResponse<T[]>): T[] {
    if (response.success) {
      return response.data || [];
    }
    throw new Error(response.message || 'API request failed');
  }
}