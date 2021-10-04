import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { NgxsModule, Store } from '@ngxs/store';

import { DateTime } from 'luxon';
import { firstValueFrom } from 'rxjs';

import { MOCK_WIZARD_ENTRY_RESPONSE } from '../../wizard/ngxs/wizard.mocks';
import { WizardEntryResponse } from '../../wizard/ngxs/wizard.model';
import { MOCK_ORGANIZATION_ACCOUNT } from '../organization/organization.mocks';

import {
  FetchEntries,
  FetchEntriesSucceeded,
  FetchImpact,
  FetchImpactStarted,
  FetchImpactSucceeded,
} from './impact.actions';
import { MOCK_IMPACT } from './impact.mocks';
import { ImpactState } from './impact.state';

const MOCK_SECOND_WIZARD_ENTRY_RESPONSE: WizardEntryResponse = {
  ...MOCK_WIZARD_ENTRY_RESPONSE,
  _id: '2',

  // Set dates to a more recent time period (to validate sorting)
  coveredPeriod: {
    startDate: DateTime.fromISO(MOCK_WIZARD_ENTRY_RESPONSE.coveredPeriod.startDate, { zone: 'utc' })
      .plus({ years: 1 })
      .toISODate(),
    endDate: DateTime.fromISO(MOCK_WIZARD_ENTRY_RESPONSE.coveredPeriod.endDate, { zone: 'utc' })
      .plus({ years: 1 })
      .toISODate(),
  },
};

describe('ImpactState', () => {
  let http: HttpTestingController;
  let store: Store;

  beforeEach(() => {
    jest.useFakeTimers();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxsModule.forRoot([ImpactState], { developmentMode: true })],
    });

    http = TestBed.inject(HttpTestingController);
    store = TestBed.inject(Store);
  });

  afterEach(() => {
    jest.useRealTimers();
    http.verify();
  });

  describe('fetch', () => {
    describe('entries', () => {
      it('should fetch and set the entries', async () => {
        const action = store.dispatch(new FetchEntries(MOCK_ORGANIZATION_ACCOUNT));

        const request = http.expectOne(() => true);
        expect(request.request.url).toContain('/starter/602135ad6d28997ec9716253/entries');

        request.flush([MOCK_WIZARD_ENTRY_RESPONSE, MOCK_SECOND_WIZARD_ENTRY_RESPONSE]);
        await firstValueFrom(action);

        const state = store.selectSnapshot(ImpactState);
        expect(state).toHaveProperty('error', null);
        expect(state).toHaveProperty('entries', [MOCK_WIZARD_ENTRY_RESPONSE, MOCK_SECOND_WIZARD_ENTRY_RESPONSE]);
      });

      it('should fetch and set an error if the entries endpoint returns an error', async () => {
        const action = store.dispatch(new FetchEntries(MOCK_ORGANIZATION_ACCOUNT));

        http.expectOne(() => true).flush('404 Not Found', { status: 404, statusText: 'Not Found' });
        await firstValueFrom(action);

        const state = store.selectSnapshot(ImpactState);
        expect(state).toHaveProperty('error', expect.objectContaining({ status: 404 }));
        expect(state).toHaveProperty('entries', []);
      });
    });

    describe('impact', () => {
      it('should fetch and set the impact', async () => {
        const action = store.dispatch(new FetchImpact(MOCK_WIZARD_ENTRY_RESPONSE));

        const request = http.expectOne(() => true);
        expect(request.request.url).toContain(
          '/starter/602135ad6d28997ec9716253/entries/61e6e611acb241000991951e/impact'
        );

        request.flush(MOCK_IMPACT);
        await firstValueFrom(action);

        const state = store.selectSnapshot(ImpactState);
        expect(state).toHaveProperty('id', MOCK_WIZARD_ENTRY_RESPONSE._id);
        expect(state).toHaveProperty('error', null);
        expect(state).toHaveProperty('impacts', [MOCK_IMPACT]);
      });

      it('should poll until calculations are complete', async () => {
        const action = store.dispatch(new FetchImpact(MOCK_WIZARD_ENTRY_RESPONSE));

        http.expectOne(() => true).flush({ ...MOCK_IMPACT, calculationComplete: false });

        let state = store.selectSnapshot(ImpactState);
        expect(state).toHaveProperty('error', null);
        expect(state).toHaveProperty('impacts', []);

        jest.runAllTimers();
        http.expectOne(() => true).flush(MOCK_IMPACT);

        await firstValueFrom(action);

        state = store.selectSnapshot(ImpactState);
        expect(state).toHaveProperty('error', null);
        expect(state).toHaveProperty('impacts', [MOCK_IMPACT]);
      });

      it('should fetch and set an error if the impact does not exist', async () => {
        const action = store.dispatch(new FetchImpact(MOCK_WIZARD_ENTRY_RESPONSE));

        http.expectOne(() => true).flush('404 Not Found', { status: 404, statusText: 'Not Found' });
        await firstValueFrom(action);

        const state = store.selectSnapshot(ImpactState);
        expect(state).toHaveProperty('error', expect.objectContaining({ status: 404 }));
        expect(state).toHaveProperty('impacts', []);
      });
    });
  });

  describe('entries', () => {
    it('should return the sorted (newest first) entries', () => {
      store.dispatch(new FetchEntriesSucceeded([MOCK_WIZARD_ENTRY_RESPONSE, MOCK_SECOND_WIZARD_ENTRY_RESPONSE]));
      const entries = store.selectSnapshot(ImpactState.entries);
      expect(entries).toEqual([MOCK_SECOND_WIZARD_ENTRY_RESPONSE, MOCK_WIZARD_ENTRY_RESPONSE]);
    });
  });

  describe('impact', () => {
    it('should return the current impact results', () => {
      store.dispatch([new FetchImpactStarted(MOCK_WIZARD_ENTRY_RESPONSE), new FetchImpactSucceeded(MOCK_IMPACT)]);
      const impact = store.selectSnapshot(ImpactState.impact);
      expect(impact).toEqual(MOCK_IMPACT);
    });

    it('should return null if there is no entry set', () => {
      const impact = store.selectSnapshot(ImpactState.impact);
      expect(impact).toEqual(null);
    });
  });
});
