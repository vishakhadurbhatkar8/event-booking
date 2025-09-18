import { CanActivateFn } from '@angular/router';

export const roleGuard: CanActivateFn = () => {
  const role = localStorage.getItem('role');
  return role === 'admin' || role === 'superadmin';
};
