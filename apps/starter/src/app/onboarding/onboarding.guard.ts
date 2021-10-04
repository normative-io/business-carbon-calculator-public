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
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { Select } from '@ngxs/store';

import { combineLatest, Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { OrganizationAccount } from '../core/organization/organization.model';
import { OrganizationState } from '../core/organization/organization.state';
import { OrganizationAccountSnapshot, User } from '../core/user/user.model';
import { UserState } from '../core/user/user.state';

export const DASHBOARD_URL = 'dashboard';
export const ONBOARDING_URL = 'onboarding';

@Injectable({ providedIn: 'root' })
export class OnboardingGuard implements CanActivate {
  @Select(UserState.user) private user$!: Observable<User>;
  @Select(UserState.acceptedTerms) private acceptedTerms$!: Observable<boolean>;

  @Select(OrganizationState.organization) private organization$!: Observable<OrganizationAccount | null>;
  @Select(UserState.organization) private organizationSnapshot$!: Observable<OrganizationAccountSnapshot | null>;

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {
    return this.user$.pipe(
      filter(Boolean),
      switchMap(() => combineLatest([this.organizationSnapshot$, this.organization$, this.acceptedTerms$])),
      map(
        ([organizationSnapshot, organization, acceptedTerms]) =>
          Boolean(organizationSnapshot || organization) && acceptedTerms
      ),
      map((requiresOnboarding) =>
        route.url.join('') === ONBOARDING_URL
          ? // If onboarding route, redirect to home if organization exists and terms have been accepted
            !requiresOnboarding || this.router.parseUrl(DASHBOARD_URL)
          : // If other pages, redirect to onboarding if no organization exists or no terms have been accepted
            requiresOnboarding || this.router.parseUrl(ONBOARDING_URL)
      )
    );
  }
}
