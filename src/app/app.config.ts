// src/app/app.config.ts - CORREGIDO
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthGuard } from './guards/auth.guard';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    // withInterceptorsFromDi() permite usar interceptors del antiguo sistema DI
    // Necesario para compatibilidad con servicios que usan interceptors
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    AuthGuard  // Solo AuthGuard, can-deactivate ahora es funcional
  ]
};