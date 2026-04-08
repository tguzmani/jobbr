import { Routes } from '@angular/router';

export const APPLICATIONS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/applications.page').then(m => m.ApplicationsComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/application-form.page').then(m => m.ApplicationFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/application-detail.page').then(m => m.ApplicationDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/application-form.page').then(m => m.ApplicationFormComponent)
  }
];
