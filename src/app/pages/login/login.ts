import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Obtener errores del email
  getEmailErrorMessage(): string {
    if (this.loginForm.get('email')?.hasError('required')) {
      return 'El email es requerido';
    }
    if (this.loginForm.get('email')?.hasError('email')) {
      return 'Ingresa un email válido';
    }
    return '';
  }

  // Obtener errores de la contraseña
  getPasswordErrorMessage(): string {
    if (this.loginForm.get('password')?.hasError('required')) {
      return 'La contraseña es requerida';
    }
    if (this.loginForm.get('password')?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  }

  // Alternar visibilidad de contraseña
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  // Enviar formulario
  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      console.log('Login exitoso:', formData);
      alert(`¡Bienvenido! Email: ${formData.email}`);
    } else {
      console.log('Formulario inválido');
      this.loginForm.markAllAsTouched();
    }
  }
}