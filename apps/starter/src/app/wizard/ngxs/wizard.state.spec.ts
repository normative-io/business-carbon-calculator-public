import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { NgxsModule, Store } from '@ngxs/store';

import { MOCK_ORGANIZATION_ACCOUNT } from '../../core/organization/organization.mocks';

import {
  ClearWizardEntry,
  FetchWizardEntry,
  FetchWizardEntryFailed,
  FetchWizardEntrySucceeded,
  SaveWizardEntry,
} from './wizard.actions';
import { MOCK_WIZARD_ENTRY, MOCK_WIZARD_ENTRY_RESPONSE } from './wizard.mocks';
import { WizardState } from './wizard.state';

const MOCK_ORGANIZATION_ACCOUNT_ID = MOCK_ORGANIZATION_ACCOUNT._id;
const MOCK_WIZARD_ENTRY_ID = MOCK_WIZARD_ENTRY_RESPONSE._id;

describe('WizardState', () => {
  let http: HttpTestingController;
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([WizardState], { developmentMode: true })],
    });

    http = TestBed.inject(HttpTestingController);
    store = TestBed.inject(Store);
  });

  afterEach(() => {
    http.verify();
  });

  describe('clear', () => {
    it('should clear any pre-fetched entry', () => {
      store.dispatch(new FetchWizardEntrySucceeded(MOCK_WIZARD_ENTRY_RESPONSE));
      store.dispatch(new ClearWizardEntry());

      const state = store.selectSnapshot(WizardState);
      expect(state).toHaveProperty('response', null);
    });
  });

  describe('fetch', () => {
    it('should fetch and set the requested entry', async () => {
      jest.spyOn(store, 'selectSnapshot').mockReturnValueOnce(MOCK_ORGANIZATION_ACCOUNT);
      const action = store.dispatch(new FetchWizardEntry(MOCK_WIZARD_ENTRY_ID));

      const request = http.expectOne(() => true);
      expect(request.request.url).toContain(`/starter/${MOCK_ORGANIZATION_ACCOUNT_ID}/entries/${MOCK_WIZARD_ENTRY_ID}`);

      request.flush(MOCK_WIZARD_ENTRY_RESPONSE);
      await action.toPromise();

      const state = store.selectSnapshot(WizardState);
      expect(state).toHaveProperty('error', null);
      expect(state).toHaveProperty('response', MOCK_WIZARD_ENTRY_RESPONSE);
    });

    it('should fetch and set an error if the requested entry does not exist', async () => {
      jest.spyOn(store, 'selectSnapshot').mockReturnValueOnce(MOCK_ORGANIZATION_ACCOUNT);
      const action = store.dispatch(new FetchWizardEntry(MOCK_WIZARD_ENTRY_ID));

      http.expectOne(() => true).flush('404 Not Found', { status: 404, statusText: 'Not Found' });
      await action.toPromise();

      const state = store.selectSnapshot(WizardState);
      expect(state).toHaveProperty('error', expect.objectContaining({ status: 404 }));
      expect(state).toHaveProperty('response', null);
    });
  });

  describe('save', () => {
    it('should save and set the requested entry', async () => {
      jest.spyOn(store, 'selectSnapshot').mockReturnValueOnce(MOCK_ORGANIZATION_ACCOUNT);
      const action = store.dispatch(new SaveWizardEntry(MOCK_WIZARD_ENTRY));

      const request = http.expectOne(() => true);
      expect(request.request.method).toEqual('POST');
      expect(request.request.url).toContain(`/starter/${MOCK_ORGANIZATION_ACCOUNT_ID}/entries`);

      request.flush(MOCK_WIZARD_ENTRY_RESPONSE);
      await action.toPromise();

      const state = store.selectSnapshot(WizardState);
      expect(state).toHaveProperty('error', null);
      expect(state).toHaveProperty('response', MOCK_WIZARD_ENTRY_RESPONSE);
    });

    it('should set the saving flag to true during the request', async () => {
      jest.spyOn(store, 'selectSnapshot').mockReturnValueOnce(MOCK_ORGANIZATION_ACCOUNT);
      const action = store.dispatch(new SaveWizardEntry(MOCK_WIZARD_ENTRY));

      let state = store.selectSnapshot(WizardState);
      expect(state).toHaveProperty('saving', true);

      http.expectOne(() => true).flush(MOCK_WIZARD_ENTRY_RESPONSE);
      await action.toPromise();

      state = store.selectSnapshot(WizardState);
      expect(state).toHaveProperty('saving', false);
    });

    it('should save and set an error if the requested entry does not exist', async () => {
      jest.spyOn(store, 'selectSnapshot').mockReturnValueOnce(MOCK_ORGANIZATION_ACCOUNT);
      const action = store.dispatch(new SaveWizardEntry(MOCK_WIZARD_ENTRY));

      http.expectOne(() => true).flush('400 Bad Request', { status: 400, statusText: 'Bad Request' });
      await action.toPromise();

      const state = store.selectSnapshot(WizardState);
      expect(state).toHaveProperty('error', expect.objectContaining({ status: 400 }));
      expect(state).toHaveProperty('response', null);
    });
  });

  describe('entry', () => {
    it('should return the entry from the current response', () => {
      store.dispatch(new FetchWizardEntrySucceeded(MOCK_WIZARD_ENTRY_RESPONSE));
      const entry = store.selectSnapshot(WizardState.entry);
      expect(entry).toEqual(MOCK_WIZARD_ENTRY);
    });

    it('should return null if there is no response set', () => {
      const entry = store.selectSnapshot(WizardState.entry);
      expect(entry).toEqual(null);
    });
  });

  describe('error', () => {
    it('should return the error from the state', () => {
      const errorResponse = new HttpErrorResponse({ status: 404, statusText: 'Not Found' });
      store.dispatch(new FetchWizardEntryFailed(errorResponse));

      const error = store.selectSnapshot(WizardState.error);
      expect(error).toEqual(errorResponse);
    });

    it('should return null if there is no error set', () => {
      const error = store.selectSnapshot(WizardState.error);
      expect(error).toEqual(null);
    });
  });

  describe('response', () => {
    it('should return the response from the state', () => {
      store.dispatch(new FetchWizardEntrySucceeded(MOCK_WIZARD_ENTRY_RESPONSE));
      const response = store.selectSnapshot(WizardState.response);
      expect(response).toEqual(MOCK_WIZARD_ENTRY_RESPONSE);
    });

    it('should return null if there is no response set', () => {
      const response = store.selectSnapshot(WizardState.response);
      expect(response).toEqual(null);
    });
  });

  describe('saving', () => {
    it('should return the saving value from the state', () => {
      let saving = store.selectSnapshot(WizardState.saving);
      expect(saving).toEqual(false);

      jest.spyOn(store, 'selectSnapshot').mockReturnValueOnce(MOCK_ORGANIZATION_ACCOUNT);
      store.dispatch(new SaveWizardEntry(MOCK_WIZARD_ENTRY));
      http.expectOne(() => true);

      saving = store.selectSnapshot(WizardState.saving);
      expect(saving).toEqual(true);
    });
  });
});
