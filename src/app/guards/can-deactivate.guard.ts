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
    if (component.canDeactivate && !component.canDeactivate()) {
      return confirm('¿Estás seguro de que quieres salir? Los datos no guardados se perderán.');
    }
    return true;
  }
}