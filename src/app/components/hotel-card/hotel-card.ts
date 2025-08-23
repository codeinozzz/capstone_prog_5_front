// src/app/components/hotel-card/hotel-card.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Hotel } from '../../services/hotel.service';

@Component({
  selector: 'app-hotel-card',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatChipsModule
  ],
  templateUrl: './hotel-card.html',
  styleUrl: './hotel-card.scss'
})
export class HotelCardComponent {
  @Input() hotel: Hotel = {
    id: '0',
    name: 'Default hotel',
    location: 'Default location',
    description: 'Default description',
    rating: 3,
    amenities: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    image: 'assets/images/hotel-default.jpg',
    price: 0
  };
  
  @Output() hotelClicked = new EventEmitter<Hotel>();

  constructor(private router: Router) {}
  
  // CORREGIDO: Navegar a habitaciones, no a booking directo
  onVerHabitaciones() {
    console.log('Ver habitaciones:', this.hotel.name);
    // Redirige a la nueva página de habitaciones
    this.router.navigate(['/hotel', this.hotel.id, 'rooms']);
  }

  getStars(): number[] {
    const rating = this.hotel.rating || 0;
    return Array(5).fill(0).map((_, i) => i < Math.floor(rating) ? 1 : 0);
  }

  getDisplayAmenities(): string[] {
    return this.hotel.amenities.slice(0, 3);
  }
}