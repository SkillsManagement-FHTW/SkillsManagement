import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';

import { AuthService } from '../services/auth/auth.service';
import { UserRole } from '../../models/enums/user-roles.enum';

export const LecturerGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser.pipe(
    take(1),
    map(user => {
      if (user?.role === UserRole.LECTURER) {
        return true;
      }

      return router.createUrlTree(['/main']);
    })
  );
};
