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

import { NgxsModule, Store } from '@ngxs/store';

import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject, Observable } from 'rxjs';

import { FetchOrganization } from '../organization/organization.actions';

import { FetchCurrentUser } from './user.actions';
import { MOCK_ORGANIZATION_ACCOUNT_SNAPSHOT } from './user.mocks';
import { OrganizationAccountSnapshot } from './user.model';
import { UserService } from './user.service';
import { UserState } from './user.state';

interface MockAuth0User {
  id: string;
}

describe('UserService', () => {
  let dispatch: jest.SpyInstance;
  let organization$: BehaviorSubject<OrganizationAccountSnapshot | null>;
  let select: jest.SpyInstance;
  let user$: BehaviorSubject<MockAuth0User | null>;

  beforeEach(() => {
    organization$ = new BehaviorSubject<OrganizationAccountSnapshot | null>(null);
    user$ = new BehaviorSubject<MockAuth0User | null>(null);

    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([], { developmentMode: true })],
      providers: [{ provide: AuthService, useValue: { user$ } }],
    });

    const store = TestBed.inject(Store);
    dispatch = jest.spyOn(store, 'dispatch').mockImplementation(() => new Observable());
    select = jest.spyOn(store, 'select').mockImplementation(() => organization$);

    TestBed.inject(UserService);
  });

  it('should fetch the current user once a user has authenticated', () => {
    expect(dispatch).not.toHaveBeenCalled();

    user$.next({ id: '1' });
    expect(dispatch).toHaveBeenCalledWith(new FetchCurrentUser());
  });

  it('should fetch the organization once a user has been fetched', () => {
    expect(dispatch).not.toHaveBeenCalled();
    expect(select).toHaveBeenCalledWith(UserState.organization);

    organization$.next(MOCK_ORGANIZATION_ACCOUNT_SNAPSHOT);
    expect(dispatch).toHaveBeenCalledWith(new FetchOrganization(MOCK_ORGANIZATION_ACCOUNT_SNAPSHOT._id));
  });
});
