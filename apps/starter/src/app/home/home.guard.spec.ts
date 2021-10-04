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
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

import { DASHBOARD_URL, HomeGuard } from './home.guard';

describe('HomeGuard', () => {
  let guard: HomeGuard;
  let isAuthenticated$: BehaviorSubject<boolean>;
  let router: Router;

  beforeEach(() => {
    isAuthenticated$ = new BehaviorSubject<boolean>(false);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: AuthService, useValue: { isAuthenticated$ } }],
    });

    router = TestBed.inject(Router);
    guard = TestBed.inject(HomeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true if the user if not authenticated', async () => {
    const response = await firstValueFrom(guard.canActivate());
    expect(response).toEqual(true);
  });

  it('should return a dashboard url tree if the user is authenticated', async () => {
    isAuthenticated$.next(true);

    const response = await firstValueFrom(guard.canActivate());
    expect(response).toEqual(router.parseUrl(DASHBOARD_URL));
  });
});
