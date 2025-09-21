import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { EventDetails } from './pages/events/event-details/event-details';
import { EventList } from './pages/events/event-list/event-list';
import { BookingDashboardComponent } from './pages/bookings/booking-dashboard/booking-dashboard';
import { AdminEvent } from './pages/admin/admin-events/admin-events';
import { ApproveEvent } from './pages/admin/approve-event/approve-event';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role.guard';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard';
import { AdminReportsComponent } from './pages/admin/admin-reports/admin-reports';
import { AdminBookingsComponent } from './pages/admin/admin-bookings/admin-bookings';


export const routes: Routes = [
  { path: '', redirectTo: 'events', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'events', component: EventList },
  { path: 'admin/reports', component: AdminReportsComponent, canActivate: [roleGuard] },
  { path: 'admin/bookings', component: AdminBookingsComponent, canActivate: [roleGuard], data: { roles: ['superadmin'] } },
  { path: 'events/:id', component: EventDetails },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [roleGuard] },
  {
    path: 'admin',
    component: AdminEvent,
    canActivate: [roleGuard],
    data: { roles: ['superadmin'] }   // only superadmin allowed
  },
  {
    path: 'bookings',
    component: BookingDashboardComponent,
    canActivate: [roleGuard],
    data: { roles: ['user', 'admin', 'superadmin'] }   // all logged-in users
  },
  { path: 'admin/events', component: AdminEvent, canActivate: [authGuard, roleGuard] },
  { path: 'admin/approve', component: ApproveEvent, canActivate: [authGuard, roleGuard] },

  { path: '**', redirectTo: 'events' }
];
