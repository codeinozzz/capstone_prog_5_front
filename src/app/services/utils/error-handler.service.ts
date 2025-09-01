import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { throwError, Observable } from 'rxjs';

export interface ErrorConfig {
  showSnackbar?: boolean;
  duration?: number;
  panelClass?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  
  constructor(private snackBar: MatSnackBar) {}

  handleHttpError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 0:
          errorMessage = 'Cannot connect to server. Please check your connection.';
          break;
        case 401:
          errorMessage = 'Unauthorized access. Please log in.';
          break;
        case 403:
          errorMessage = 'Access forbidden.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
        case 503:
          errorMessage = 'Service unavailable. Please try again later.';
          break;
        default:
          errorMessage = error.error?.message || `Error ${error.status}: ${error.message}`;
      }
    }
    
    console.error('HTTP Error:', {
      status: error.status,
      message: errorMessage,
      url: error.url,
      error: error.error
    });
    
    return throwError(() => new Error(errorMessage));
  }


  showError(message: string, config: ErrorConfig = {}): void {
    const defaultConfig = {
      showSnackbar: true,
      duration: 5000,
      panelClass: ['error-snackbar']
    };
    
    const finalConfig = { ...defaultConfig, ...config };
    
    if (finalConfig.showSnackbar) {
      this.snackBar.open(message, 'Close', {
        duration: finalConfig.duration,
        panelClass: finalConfig.panelClass
      });
    }
  }

 
  showSuccess(message: string, duration = 3000): void {
    this.snackBar.open(message, 'Close', {
      duration: duration,
      panelClass: ['success-snackbar']
    });
  }

  
  handleComponentError(error: any, context = 'Operation'): string {
    const message = error.error?.message || error.message || `${context} failed`;
    this.showError(message);
    return message;
  }
}