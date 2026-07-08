import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return toObservable(auth.initialized).pipe(
    filter(Boolean),
    take(1),
    map(() => {
      return auth.user()
        ? true
        : router.createUrlTree(['/login']);
    })
  );
};