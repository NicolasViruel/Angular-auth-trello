import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '@services/token.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router); // Corregir la variable a minúscula
  const tokenService = inject(TokenService);
  const isValidToken = tokenService.isValidRefreshToken();

  if (!isValidToken) {
    console.log('isValidtoken from authGuard', isValidToken);
    
    router.navigate(['/login']); // Usar la instancia correcta del router inyectado
    return false;
  }
  return true;
};
