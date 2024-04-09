import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.component'),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.component'),
  },
  {
    path: 'checklist/:id',
    loadComponent: () => import('./checklist/checklist.component'),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
