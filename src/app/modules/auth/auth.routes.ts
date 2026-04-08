import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/auth.page').then(m => m.AuthComponent)
  }
];
