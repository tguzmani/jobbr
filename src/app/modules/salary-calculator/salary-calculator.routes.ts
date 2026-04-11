import { Routes } from '@angular/router';

export const SALARY_CALCULATOR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/salary-calculator.page').then(m => m.SalaryCalculatorComponent)
  }
];
