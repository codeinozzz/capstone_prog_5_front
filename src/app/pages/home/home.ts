import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';
import { HotelCardComponent, Hotel } from '../../components/hotel-card/hotel-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, HotelCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {
  hotels: Hotel[] = [
    {
      id: 1,
      name: 'Hotel Conchitas',
      location: 'La Paz, Bolivia',
      price: 120,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      name: 'Hotel Rosario',
      location: 'Centro, La Paz',
      price: 85,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      name: 'Hotel Casa Grande',
      location: 'Zona Sur, La Paz',
      price: 150,
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop'
    }
  ];

  onHotelReservado(hotel: Hotel) {
    alert(`Reserva para: ${hotel.name} - $${hotel.price}/noche`);
  }
}