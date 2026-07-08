import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'orders', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/orders/order-list.component').then(
        (m) => m.OrderListComponent
      ),
  },
  {
    path: 'orders/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/orders/order-create.component').then(
        (m) => m.OrderCreateComponent
      ),
  },
  { path: '**', redirectTo: 'orders' },
];
