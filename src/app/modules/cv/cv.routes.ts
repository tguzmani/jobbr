import { Routes } from '@angular/router';

export const CV_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/cv-list/cv-list.page').then(m => m.CvListComponent)
  }
];
