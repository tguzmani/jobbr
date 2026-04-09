import { Routes } from '@angular/router';

export const TASKS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/tasks.page').then(m => m.TasksComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/task-form.page').then(m => m.TaskFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/task-detail.page').then(m => m.TaskDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/task-form.page').then(m => m.TaskFormComponent)
  }
];
