import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoading()) {
    return new Promise<boolean>((resolve) => {
      const check = setInterval(() => {
        if (!authService.isLoading()) {
          clearInterval(check);
          if (authService.currentUser()) {
            resolve(true);
          } else {
            router.navigate(['/auth']);
            resolve(false);
          }
        }
      }, 50);
    });
  }

  if (authService.currentUser()) {
    return true;
  }

  router.navigate(['/auth']);
  return false;
};

export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoading()) {
    return new Promise<boolean>((resolve) => {
      const check = setInterval(() => {
        if (!authService.isLoading()) {
          clearInterval(check);
          if (authService.currentUser()) {
            router.navigate(['/dashboard']);
            resolve(false);
          } else {
            resolve(true);
          }
        }
      }, 50);
    });
  }

  if (authService.currentUser()) {
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
