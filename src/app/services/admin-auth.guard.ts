import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { switchMap, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { AppUser } from '../models/app-user';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const userService = inject(UserService);

  return auth.appUser$.pipe(
    map((appUser) => (appUser?.isAdmin ? appUser.isAdmin : false))
  );
};
