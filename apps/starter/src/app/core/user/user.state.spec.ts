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

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { NgxsModule, Store } from '@ngxs/store';

import { firstValueFrom } from 'rxjs';

import { AcceptTerms, FetchCurrentUser, FetchCurrentUserSucceeded } from './user.actions';
import { MOCK_ORGANIZATION_ACCOUNT_SNAPSHOT, MOCK_USER } from './user.mocks';
import { User } from './user.model';
import { LAST_UPDATED_TERMS, UserState } from './user.state';

describe('UserState', () => {
  let http: HttpTestingController;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([UserState], { developmentMode: true })],
    });

    http = TestBed.inject(HttpTestingController);
    store = TestBed.inject(Store);
  });

  afterEach(() => {
    http.verify();
  });

  describe('fetch', () => {
    it('should fetch and set the current user', async () => {
      const action = store.dispatch(new FetchCurrentUser());

      const request = http.expectOne(() => true);
      expect(request.request.url).toContain('/users/me');

      request.flush(MOCK_USER);
      await firstValueFrom(action);

      const state = store.selectSnapshot(UserState);
      expect(state).toHaveProperty('error', null);
      expect(state).toHaveProperty('user', MOCK_USER);
    });

    it('should fetch and set an error if the current user does not exist', async () => {
      const action = store.dispatch(new FetchCurrentUser());

      const request = http.expectOne(() => true);
      expect(request.request.url).toContain('/users/me');

      request.flush('404 Not Found', { status: 404, statusText: 'Not Found' });
      await firstValueFrom(action);

      const state = store.selectSnapshot(UserState);
      expect(state).toHaveProperty('error', expect.objectContaining({ status: 404 }));
      expect(state).toHaveProperty('user', null);
    });
  });

  describe('terms', () => {
    it('should accept the terms', async () => {
      store.dispatch(new FetchCurrentUserSucceeded(MOCK_USER));
      const action = store.dispatch(new AcceptTerms(true));

      const request = http.expectOne(() => true);
      expect(request.request.method).toEqual('PUT');
      expect(request.request.url).toContain(`/users/${MOCK_USER._id}/bccTerms`);
      expect(request.request.body).toEqual({ bccTerms: true });

      const payload: User = { ...MOCK_USER, bccTerms: new Date().toISOString() };
      request.flush(payload);
      await firstValueFrom(action);

      const state = store.selectSnapshot(UserState);
      expect(state).toHaveProperty('error', null);
      expect(state).toHaveProperty('user', payload);
    });
  });

  describe('user', () => {
    it('should return the current user', () => {
      store.dispatch(new FetchCurrentUserSucceeded(MOCK_USER));
      const user = store.selectSnapshot(UserState.user);
      expect(user).toEqual(MOCK_USER);
    });

    it('should return null if there is no user set', () => {
      const user = store.selectSnapshot(UserState.user);
      expect(user).toEqual(null);
    });
  });

  describe('organization', () => {
    it('return the organization account from the current user', () => {
      store.dispatch(new FetchCurrentUserSucceeded(MOCK_USER));
      const organization = store.selectSnapshot(UserState.organization);
      expect(organization).toEqual(MOCK_ORGANIZATION_ACCOUNT_SNAPSHOT);
    });

    it('should return null if there is no user set', () => {
      const organization = store.selectSnapshot(UserState.organization);
      expect(organization).toEqual(null);
    });
  });

  describe('acceptedTerms', () => {
    const lastUpdatedTerms = LAST_UPDATED_TERMS.toFormat('d LLL yyyy');

    it(`should return true if the user has accepted terms the since ${lastUpdatedTerms}`, () => {
      const dayAfter = LAST_UPDATED_TERMS.plus({ days: 1 });
      store.dispatch(new FetchCurrentUserSucceeded({ ...MOCK_USER, bccTerms: dayAfter.toISODate() }));

      const acceptedTerms = store.selectSnapshot(UserState.acceptedTerms);
      expect(acceptedTerms).toEqual(true);
    });

    it(`should return false if the user hasn't accepted the terms since ${lastUpdatedTerms}`, () => {
      const dayBefore = LAST_UPDATED_TERMS.minus({ days: 1 });
      store.dispatch(new FetchCurrentUserSucceeded({ ...MOCK_USER, bccTerms: dayBefore.toISODate() }));

      const acceptedTerms = store.selectSnapshot(UserState.acceptedTerms);
      expect(acceptedTerms).toEqual(false);
    });

    it("should return false if the user hasn't accepted the terms at all", () => {
      store.dispatch(new FetchCurrentUserSucceeded({ ...MOCK_USER, bccTerms: undefined }));

      const acceptedTerms = store.selectSnapshot(UserState.acceptedTerms);
      expect(acceptedTerms).toEqual(false);
    });
  });
});
