import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.html',
  styleUrl: './search.scss'
})
export class SearchComponent {
  // @Output: Envía término de búsqueda al padre
  @Output() searchTerm = new EventEmitter<string>();

  // Término de búsqueda
  searchText = '';

  // Método para buscar
  onSearch() {
    console.log('Buscando:', this.searchText);
    this.searchTerm.emit(this.searchText);
  }

  // Método para limpiar
  onClear() {
    this.searchText = '';
    this.searchTerm.emit('');
  }
}