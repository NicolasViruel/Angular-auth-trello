import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '@services/token.service';

export const RedirectGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Corregir la variable a minúscula
  const tokenService = inject(TokenService);
  const isValidToken = tokenService.isValidToken();

  if (isValidToken) {
    router.navigate(['/app']); // Usar la instancia correcta del router inyectado
    return false;
  }
  return true;
};
