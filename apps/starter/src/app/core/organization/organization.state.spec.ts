import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { NgxsModule, Store } from '@ngxs/store';

import { firstValueFrom } from 'rxjs';

import {
  CreateOrganization,
  CreateOrganizationSucceeded,
  FetchOrganization,
  FetchOrganizationSucceeded,
  UpdateOrganization,
} from './organization.actions';
import { MOCK_ORGANIZATION_ACCOUNT } from './organization.mocks';
import { OrganizationAccountType } from './organization.model';
import { OrganizationState } from './organization.state';

const MOCK_ORGANIZATION_ID = MOCK_ORGANIZATION_ACCOUNT._id;

describe('OrganizationState', () => {
  let http: HttpTestingController;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([OrganizationState], { developmentMode: true })],
    });

    http = TestBed.inject(HttpTestingController);
    store = TestBed.inject(Store);
  });

  afterEach(() => {
    http.verify();
  });

  describe('create', () => {
    it('should set the organization if the organization creation succeeds', async () => {
      const action = store.dispatch(new CreateOrganization({ name: 'Mock Organization 1', vat: '123' }));

      const request = http.expectOne(() => true);
      expect(request.request.url).toContain('/organizationAccounts');
      expect(request.request.method).toEqual('POST');
      expect(request.request.body).toEqual({
        accountType: OrganizationAccountType.STARTER,
        name: 'Mock Organization 1',
        vat: '123',
      });

      request.flush(MOCK_ORGANIZATION_ACCOUNT);
      await firstValueFrom(action);

      const state = store.selectSnapshot(OrganizationState);
      expect(state).toHaveProperty('error', null);
      expect(state).toHaveProperty('organization', MOCK_ORGANIZATION_ACCOUNT);
    });

    it('should set an error if the organization creation fails', async () => {
      const action = store.dispatch(new CreateOrganization({ name: 'Mock Organization 1', vat: '123' }));

      const request = http.expectOne(() => true);
      request.flush('400 Bad Request', { status: 400, statusText: 'Bad Request' });
      await firstValueFrom(action);

      const state = store.selectSnapshot(OrganizationState);
      expect(state).toHaveProperty('error', expect.objectContaining({ status: 400 }));
      expect(state).toHaveProperty('organization', null);
    });
  });

  describe('fetch', () => {
    it('should set the organization if the organization fetch succeeds', async () => {
      const action = store.dispatch(new FetchOrganization(MOCK_ORGANIZATION_ID));

      const request = http.expectOne(() => true);
      expect(request.request.url).toContain(`/organizationAccounts/${MOCK_ORGANIZATION_ID}`);
      expect(request.request.method).toEqual('GET');

      request.flush(MOCK_ORGANIZATION_ACCOUNT);
      await firstValueFrom(action);

      const state = store.selectSnapshot(OrganizationState);
      expect(state).toHaveProperty('error', null);
      expect(state).toHaveProperty('organization', MOCK_ORGANIZATION_ACCOUNT);
    });

    it('should set an error if the organization fetch fails', async () => {
      const action = store.dispatch(new FetchOrganization(MOCK_ORGANIZATION_ID));

      const request = http.expectOne(() => true);
      request.flush('404 Not Found', { status: 404, statusText: 'Not Found' });
      await firstValueFrom(action);

      const state = store.selectSnapshot(OrganizationState);
      expect(state).toHaveProperty('error', expect.objectContaining({ status: 404 }));
      expect(state).toHaveProperty('organization', null);
    });
  });

  describe('update', () => {
    it('should set the updated organization if the organization update succeeds', async () => {
      store.dispatch(new FetchOrganizationSucceeded(MOCK_ORGANIZATION_ACCOUNT));
      const action = store.dispatch(new UpdateOrganization({ nace: '1' }));

      const request = http.expectOne(() => true);
      expect(request.request.url).toContain(`/organizationAccounts/${MOCK_ORGANIZATION_ID}/details`);
      expect(request.request.method).toEqual('PUT');
      expect(request.request.body).toEqual({ nace: '1' });

      const updated = { ...MOCK_ORGANIZATION_ACCOUNT, nace: '1' };
      request.flush(updated);
      await firstValueFrom(action);

      const state = store.selectSnapshot(OrganizationState);
      expect(state).toHaveProperty('error', null);
      expect(state).toHaveProperty('organization', updated);
    });

    it('should set an error if the organization update fails', async () => {
      store.dispatch(new FetchOrganizationSucceeded(MOCK_ORGANIZATION_ACCOUNT));
      const action = store.dispatch(new UpdateOrganization({ nace: '1' }));

      const request = http.expectOne(() => true);
      request.flush('404 Not Found', { status: 404, statusText: 'Not Found' });
      await firstValueFrom(action);

      const state = store.selectSnapshot(OrganizationState);
      expect(state).toHaveProperty('error', expect.objectContaining({ status: 404 }));
    });
  });

  describe('organization', () => {
    it('should return the organization', () => {
      store.dispatch(new CreateOrganizationSucceeded(MOCK_ORGANIZATION_ACCOUNT));
      const organization = store.selectSnapshot(OrganizationState.organization);
      expect(organization).toEqual(MOCK_ORGANIZATION_ACCOUNT);
    });

    it('should return null if there is no organization set', () => {
      const organization = store.selectSnapshot(OrganizationState.organization);
      expect(organization).toEqual(null);
    });
  });
});
