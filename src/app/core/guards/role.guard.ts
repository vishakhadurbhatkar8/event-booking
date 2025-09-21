import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const role = localStorage.getItem('role');
  const path = route.routeConfig?.path;

  // not logged in → redirect
  if (!role) {
    return router.parseUrl('/login');
  }

  // admin routes → only superadmin allowed
  if (path?.startsWith('admin')) {
    return role === 'superadmin';
  }

  // bookings/events → any logged-in role
  return true;
};
