import { Injectable } from '@angular/core';

export interface DateFormatOptions {
  locale?: string;
  format?: 'short' | 'long' | 'full' | 'custom';
  customOptions?: Intl.DateTimeFormatOptions;
}

@Injectable({
  providedIn: 'root'
})
export class DateUtilsService {


  formatDate(dateInput: string | Date | null, options: DateFormatOptions = {}): string {
    if (!dateInput) return 'N/A';
    
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    const { locale = 'en-US', format = 'short' } = options;

    switch (format) {
      case 'short':
        return date.toLocaleDateString(locale);
        
      case 'long':
        return date.toLocaleDateString(locale, {
          weekday: 'long',
          year: 'numeric',
          month: 'long', 
          day: 'numeric'
        });
        
      case 'full':
        return date.toLocaleDateString(locale, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
      case 'custom':
        return date.toLocaleDateString(locale, options.customOptions);
        
      default:
        return date.toLocaleDateString(locale);
    }
  }

  getDaysDifference(startDate: string | Date, endDate: string | Date): number {
    const start = typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
    
    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }


  getDaysUntil(targetDate: string | Date): number {
    const today = new Date();
    const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
    
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    
    return this.getDaysDifference(today, target);
  }

 
  getDaysMessage(targetDate: string | Date): string {
    const days = this.getDaysUntil(targetDate);
    
    if (days < 0) {
      return 'Date has already passed';
    } else if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Tomorrow';
    } else {
      return `${days} days from now`;
    }
  }

  
  isValidDate(date: any): boolean {
    if (!date) return false;
    const d = new Date(date);
    return !isNaN(d.getTime());
  }


  toISOString(date: Date | null): string | null {
    if (!date) return null;
    return date.toISOString();
  }


  toISODateString(date: Date | null): string | null {
    if (!date) return null;
    return date.toISOString().split('T')[0];
  }

 
  getMinDate(): Date {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  isValidDateRange(startDate: Date | null, endDate: Date | null): boolean {
    if (!startDate || !endDate) return false;
    return endDate > startDate;
  }

  
  formatDuration(days: number): string {
    if (days <= 0) return '0 days';
    if (days === 1) return '1 day';
    return `${days} days`;
  }
}