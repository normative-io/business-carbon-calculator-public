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

import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, UrlSegment } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { NgxsModule, Store } from '@ngxs/store';

import { BehaviorSubject, firstValueFrom } from 'rxjs';

import { MOCK_ORGANIZATION_ACCOUNT } from '../core/organization/organization.mocks';
import { OrganizationAccount } from '../core/organization/organization.model';
import { OrganizationState } from '../core/organization/organization.state';
import { MOCK_ORGANIZATION_ACCOUNT_SNAPSHOT, MOCK_USER } from '../core/user/user.mocks';
import { OrganizationAccountSnapshot, User } from '../core/user/user.model';
import { UserState } from '../core/user/user.state';

import { DASHBOARD_URL, OnboardingGuard, ONBOARDING_URL } from './onboarding.guard';

describe('OnboardingGuard', () => {
  let acceptedTerms$: BehaviorSubject<boolean>;
  let guard: OnboardingGuard;
  let organization$: BehaviorSubject<OrganizationAccount | null>;
  let router: Router;
  let snapshot$: BehaviorSubject<OrganizationAccountSnapshot | null>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([], { developmentMode: true }), RouterTestingModule],
    });

    const user$ = new BehaviorSubject<User | null>(MOCK_USER);
    snapshot$ = new BehaviorSubject<OrganizationAccountSnapshot | null>(null);
    organization$ = new BehaviorSubject<OrganizationAccount | null>(null);
    acceptedTerms$ = new BehaviorSubject<boolean>(false);

    const store = TestBed.inject(Store);
    jest.spyOn(store, 'select').mockImplementation((arg: unknown) => {
      switch (arg) {
        case UserState.user:
          return user$;
        case UserState.organization:
          return snapshot$;
        case UserState.acceptedTerms:
          return acceptedTerms$;
        case OrganizationState.organization:
          return organization$;
        default:
          return new BehaviorSubject(null);
      }
    });

    router = TestBed.inject(Router);
    guard = TestBed.inject(OnboardingGuard);
  });

  const createRouteSnapshot = (path: string): ActivatedRouteSnapshot => {
    const snapshot = new ActivatedRouteSnapshot();
    snapshot.url = [new UrlSegment(path, {})];
    return snapshot;
  };

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect a user to the onboarding if an organization does not exist', async () => {
    const route = createRouteSnapshot(DASHBOARD_URL);

    const response = await firstValueFrom(guard.canActivate(route));
    expect(response).toEqual(router.parseUrl(ONBOARDING_URL));
  });

  it('should redirect a user to the onboarding if the terms have not been accepted', async () => {
    const route = createRouteSnapshot(DASHBOARD_URL);
    snapshot$.next(MOCK_ORGANIZATION_ACCOUNT_SNAPSHOT);

    const response = await firstValueFrom(guard.canActivate(route));
    expect(response).toEqual(router.parseUrl(ONBOARDING_URL));
  });

  it('should redirect a user to the dashboard if an organization snapshot already exists', async () => {
    const route = createRouteSnapshot(ONBOARDING_URL);
    snapshot$.next(MOCK_ORGANIZATION_ACCOUNT_SNAPSHOT);
    acceptedTerms$.next(true);

    const response = await firstValueFrom(guard.canActivate(route));
    expect(response).toEqual(router.parseUrl(DASHBOARD_URL));
  });

  it('should redirect a user to the dashboard if an organization already exists', async () => {
    const route = createRouteSnapshot(ONBOARDING_URL);
    organization$.next(MOCK_ORGANIZATION_ACCOUNT);
    acceptedTerms$.next(true);

    const response = await firstValueFrom(guard.canActivate(route));
    expect(response).toEqual(router.parseUrl(DASHBOARD_URL));
  });

  it('should not redirect a user on the onboarding page without an organization', async () => {
    const route = createRouteSnapshot(ONBOARDING_URL);

    const response = await firstValueFrom(guard.canActivate(route));
    expect(response).toEqual(true);
  });

  it('should not redirect a user on any other page with an organization snapshot', async () => {
    const route = createRouteSnapshot('other');
    snapshot$.next(MOCK_ORGANIZATION_ACCOUNT_SNAPSHOT);
    acceptedTerms$.next(true);

    const response = await firstValueFrom(guard.canActivate(route));
    expect(response).toEqual(true);
  });

  it('should not redirect a user on any other page with an organization', async () => {
    const route = createRouteSnapshot('other');
    organization$.next(MOCK_ORGANIZATION_ACCOUNT);
    acceptedTerms$.next(true);

    const response = await firstValueFrom(guard.canActivate(route));
    expect(response).toEqual(true);
  });
});
