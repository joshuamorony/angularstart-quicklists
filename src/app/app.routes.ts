import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.component'),
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
];
