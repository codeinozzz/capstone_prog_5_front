import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface Hotel {
  id: number;
  name: string;
  location: string;
  price: number;
  image: string; 
}

@Component({
  selector: 'app-hotel-card',
  standalone: true,
  imports: [],
  templateUrl: './hotel-card.html',
  styleUrl: './hotel-card.scss'
})
export class HotelCardComponent {
  @Input() hotel: Hotel = {
    id: 0,
    name: 'Hotel por defecto',
    location: 'Ubicación por defecto',
    price: 0,
    image: 'assets/images/hotel-default.jpg' 
  };
  
  @Output() hotelClicked = new EventEmitter<Hotel>();
  
  onReservar() {
    console.log('Reservando:', this.hotel.name);
    this.hotelClicked.emit(this.hotel);
  }
}