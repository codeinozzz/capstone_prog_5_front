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
    console.log('Guard executing...');
    
    if (!component || typeof component.canDeactivate !== 'function') {
      console.log('Component does not implement canDeactivate correctly');
      return true;
    }

    const canLeave = component.canDeactivate();
    console.log('Component says it can leave:', canLeave);

    if (!canLeave) {
      const userConfirms = confirm(
        'Are you sure you want to leave?\n\nYou have unsaved changes that will be lost.'
      );
      console.log('User confirmed:', userConfirms);
      return userConfirms;
    }

    console.log('Allowing navigation');
    return true;
  }
}