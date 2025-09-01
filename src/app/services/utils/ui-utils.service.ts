import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiUtilsService {


  trackById<T extends { id: string }>(index: number, item: T): string {
    return item?.id || index.toString();
  }

 
  toTitleCase(text: string): string {
    if (!text) return '';
    return text.toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase());
  }

 
  truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  }


  getStarsArray(rating: number): number[] {
    const stars = Math.max(0, Math.min(5, Math.floor(rating)));
    return Array(5).fill(0).map((_, i) => i < stars ? 1 : 0);
  }


  getDefaultHotelImage(): string {
    const defaultImages = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop'
    ];
    return defaultImages[Math.floor(Math.random() * defaultImages.length)];
  }

 
  calculateDefaultPrice(rating: number): number {
    const basePrice = 80;
    return Math.floor(basePrice + (rating * 20) + Math.random() * 50);
  }


  getUserDisplayName(user: any): string {
    if (!user) return 'User';
    
    if (user.firstName) {
      return user.firstName;
    }
    
    if (user.username) {
      return user.username;
    }
    
    if (user.emailAddresses?.[0]?.emailAddress) {
      return user.emailAddresses[0].emailAddress.split('@')[0];
    }
    
    return 'User';
  }


  getUserEmail(user: any): string {
    return user?.emailAddresses?.[0]?.emailAddress || '';
  }

  getRoomTypeLabel(type: string): string {
    const types: { [key: string]: string } = {
      'individual_1': 'Single - 1 person',
      'individual_2': 'Single - 2 people', 
      'individual_3': 'Single - 3 people',
      'suite_2': 'Suite - 2 people',
      'suite_family': 'Family Suite'
    };
    return types[type] || this.toTitleCase(type.replace('_', ' '));
  }

  generateConfirmationNumber(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    
    let result = '';
    
    for (let i = 0; i < 2; i++) {
      result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    for (let i = 0; i < 4; i++) {
      result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    return result;
  }


  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'confirmed': 'primary',
      'cancelled': 'warn',
      'pending': 'accent',
      'completed': 'primary'
    };
    return statusColors[status] || '';
  }

 
  getStatusIcon(status: string): string {
    const statusIcons: { [key: string]: string } = {
      'confirmed': 'check_circle',
      'cancelled': 'cancel',
      'pending': 'schedule',
      'completed': 'done_all'
    };
    return statusIcons[status] || 'help';
  }

 
  limitArray<T>(array: T[], limit: number): T[] {
    if (!array) return [];
    return array.slice(0, limit);
  }
}