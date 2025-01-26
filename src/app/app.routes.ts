import { Routes } from '@angular/router';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { authenticatedGuard } from './core/guards/authenticated.guard';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [authenticatedGuard]
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      //{ path: 'dashboard', loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'employees', loadChildren: () => import('./features/employees/employees.routes').then(m => m.EMPLOYEES_ROUTES) },
      { path: 'customers', loadChildren: () => import('./features/customers/customers.routes').then(m => m.CUSTOMERS_ROUTES) },
      { path: 'rooms', loadChildren: () => import('./features/rooms/rooms.routes').then(m => m.ROOMS_ROUTES) },
      { path: 'bookings', loadChildren: () => import('./features/bookings/bookings.routes').then(m => m.BOOKINGS_ROUTES) },
      { path: '', redirectTo: 'bookings', pathMatch: 'full' },
    ],
    canActivate: [authGuard]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];