import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get token from localStorage
  const authToken = localStorage.getItem('authToken');

  // Clone the request and add the Authorization header if the token exists
  const clonedRequest = authToken
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${authToken}`,
        },
      })
    : req;

  // Pass the modified request to the next handler
  return next(clonedRequest);
};
