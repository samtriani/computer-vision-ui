import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RolService } from '../services/rol.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};

// Evita entrar por URL directa (o quedarse tras refrescar) a una pantalla que
// el rol activo no debería ver — misma regla que oculta los links en el topbar.
export const rolGuard: CanActivateFn = (_route, state) => {
  const rolService = inject(RolService);
  const router = inject(Router);

  if (rolService.rutaPermitida(state.url)) {
    return true;
  }
  return router.createUrlTree([rolService.rutaPorDefecto()]);
};

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/dashboard']);
};
