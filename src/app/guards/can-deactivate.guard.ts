// src/app/guards/can-deactivate.guard.ts - MEJORADO
import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

export interface CanComponentDeactivate {
  canDeactivate: () => boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  
  canDeactivate(component: CanComponentDeactivate): boolean {
    console.log('🛡️ Guard ejecutándose...');
    
    // Verificar si el componente tiene el método canDeactivate
    if (!component || typeof component.canDeactivate !== 'function') {
      console.log('⚠️ Componente no implementa canDeactivate correctamente');
      return true;
    }

    // Obtener la decisión del componente
    const canLeave = component.canDeactivate();
    console.log('📝 Componente dice que puede salir:', canLeave);

    // Si el componente dice que NO puede salir, mostrar confirmación
    if (!canLeave) {
      const userConfirms = confirm(
        '¿Estás seguro de que quieres salir?\n\nTienes cambios sin guardar que se perderán.'
      );
      console.log('👤 Usuario confirmó:', userConfirms);
      return userConfirms;
    }

    // Si el componente dice que SÍ puede salir, permitir
    console.log('✅ Permitiendo navegación');
    return true;
  }
}