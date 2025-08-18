// src/app/components/search/search.ts
import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: './search.html',
  styleUrl: './search.scss'
})
export class SearchComponent {
  @Output() searchTerm = new EventEmitter<string>();
  @Output() clearSearch = new EventEmitter<void>();

  searchText = '';

  onSearch() {
    if (this.searchText.trim()) {
      console.log('Buscando:', this.searchText);
      this.searchTerm.emit(this.searchText.trim());
    }
  }

  onClear() {
    this.searchText = '';
    this.clearSearch.emit();
  }

  // Buscar al presionar Enter
  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }
}