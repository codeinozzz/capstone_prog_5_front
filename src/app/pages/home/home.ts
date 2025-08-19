import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { HeaderComponent } from '../../components/header/header';
import { FooterComponent } from '../../components/footer/footer';
import { HotelCardComponent } from '../../components/hotel-card/hotel-card';
import { SearchComponent } from '../../components/search/search';
import { HotelService, Hotel } from '../../services/hotel.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    HeaderComponent, 
    FooterComponent, 
    HotelCardComponent,
    SearchComponent,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent implements OnInit {
  hotels: Hotel[] = [];
  loading = false;
  error: string | null = null;
  isSearching = false;
  searchTerm = '';

  constructor(
    private hotelService: HotelService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadHotels();
  }

  loadHotels() {
    this.loading = true;
    this.error = null;

    this.hotelService.getHotels().subscribe({
      next: (hotels) => {
        this.hotels = hotels;
        this.loading = false;
        console.log('Hotels loaded:', hotels);
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        console.error('Error loading hotels:', error);
        
        this.snackBar.open(
          'Error loading hotels: ' + error.message, 
          'Close', 
          {
            duration: 5000,
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

  retryLoadHotels() {
    this.loadHotels();
  }

  onHotelReservado(hotel: Hotel) {
    const snackBarRef = this.snackBar.open(
      `Interested in: ${hotel.name} - $${hotel.price}/night`, 
      'See more', 
      {
        duration: 3000
      }
    );

    snackBarRef.onAction().subscribe(() => {
      console.log('See more details of:', hotel);
    });
  }

  trackByHotelId(index: number, hotel: Hotel): string {
    return hotel.id;
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.isSearching = true;
    this.loading = true;
    this.error = null;

    this.hotelService.searchHotels(term).subscribe({
      next: (hotels) => {
        this.hotels = hotels;
        this.loading = false;
        console.log('Hotels found:', hotels);
        
        if (hotels.length === 0) {
          this.snackBar.open(
            `No hotels found in "${term}"`, 
            'Close', 
            { duration: 3000 }
          );
        }
      },
      error: (error) => {
        this.error = error.message;
        this.loading = false;
        console.error('Search error:', error);
        
        this.snackBar.open(
          'Search error: ' + error.message, 
          'Close', 
          {
            duration: 5000,
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

  onClearSearch() {
    this.searchTerm = '';
    this.isSearching = false;
    this.loadHotels();
  }

  getCurrentTime(): Date {
    return new Date();
  }
}