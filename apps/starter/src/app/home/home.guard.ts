// Copyright 2022 Meta Mind AB
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
