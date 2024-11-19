import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLoggedIn = !!localStorage.getItem('authToken'); // Check if user is logged in
  if (!isLoggedIn) {
    router.navigate(['/login']); // Redirect to login if not authenticated
    return false;
  }
  return true;
};
