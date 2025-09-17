import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const token = localStorage.getItem('token');
  return !!token; // true if logged in, false otherwise
};
