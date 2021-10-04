import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '@auth0/auth0-angular';
import { map } from 'rxjs/operators';

export const DASHBOARD_URL = 'dashboard';

@Injectable({ providedIn: 'root' })
export class HomeGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    return this.authService.isAuthenticated$.pipe(
      map((isAuthenticated) =>
        // Redirect authenticated users to the dashboard
        isAuthenticated ? this.router.parseUrl(DASHBOARD_URL) : true
      )
    );
  }
}
