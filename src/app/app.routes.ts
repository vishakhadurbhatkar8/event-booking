import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { EventDetails } from './pages/events/event-details/event-details';
import { EventList } from './pages/events/event-list/event-list';
import { BookingDashboard } from './pages/bookings/booking-dashboard/booking-dashboard';
import { AdminEvents } from './pages/admin/admin-events/admin-events';
import { ApproveEvent } from './pages/admin/approve-event/approve-event';
import { authGuard } from './core/guards/auth-guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'events', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'events', component: EventList },
  { path: 'events/:id', component: EventDetails },
  { path: 'bookings', component: BookingDashboard, canActivate: [authGuard] },
  { path: 'admin/events', component: AdminEvents, canActivate: [authGuard, roleGuard] },
  { path: 'admin/approve', component: ApproveEvent, canActivate: [authGuard, roleGuard] },

  { path: '**', redirectTo: 'events' }
];
