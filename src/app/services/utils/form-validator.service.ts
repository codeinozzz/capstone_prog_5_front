import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';

export interface FieldConfig {
  fieldName: string;
  displayName?: string;
  customMessages?: { [key: string]: string };
}

@Injectable({
  providedIn: 'root'
})
export class FormValidatorService {

  
  getFieldError(form: FormGroup, fieldName: string, displayName?: string): string {
    const field = form.get(fieldName);
    const name = displayName || this.formatFieldName(fieldName);

    if (!field?.errors) return '';

    const errors = field.errors;

    if (errors['required']) {
      return `${name} is required`;
    }
    
    if (errors['email']) {
      return 'Please enter a valid email address';
    }
    
    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      return `${name} must be at least ${requiredLength} characters long`;
    }
    
    if (errors['maxlength']) {
      const requiredLength = errors['maxlength'].requiredLength;
      return `${name} cannot exceed ${requiredLength} characters`;
    }
    
    if (errors['min']) {
      return `${name} must be greater than ${errors['min'].min}`;
    }
    
    if (errors['max']) {
      return `${name} must be less than ${errors['max'].max}`;
    }
    
    if (errors['pattern']) {
      return `${name} format is invalid`;
    }

    return `${name} is invalid`;
  }

  hasFieldError(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field?.invalid && (field?.touched || field?.dirty));
  }

  
  markAllFieldsAsTouched(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markAllFieldsAsTouched(control);
      }
    });
  }

  /**
   * Obtiene todos los errores de un formulario
   */
  getAllFormErrors(form: FormGroup): { [key: string]: string } {
    const errors: { [key: string]: string } = {};
    
    Object.keys(form.controls).forEach(key => {
      const error = this.getFieldError(form, key);
      if (error) {
        errors[key] = error;
      }
    });
    
    return errors;
  }


  isValidDateRange(startDate: Date | null, endDate: Date | null): boolean {
    if (!startDate || !endDate) return false;
    return endDate > startDate;
  }


  private formatFieldName(fieldName: string): string {
    return fieldName
      .replace(/([A-Z])/g, ' $1') // camelCase to spaces
      .replace(/^./, str => str.toUpperCase()) // Primera letra mayúscula
      .trim();
  }


  validateFields(form: FormGroup, fields: string[]): boolean {
    return fields.every(field => {
      const control = form.get(field);
      return control?.valid ?? false;
    });
  }


  resetForm(form: FormGroup): void {
    form.reset();
    Object.keys(form.controls).forEach(key => {
      form.get(key)?.setErrors(null);
      form.get(key)?.markAsUntouched();
    });
  }
}