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

import { BehaviorSubject, Observable } from 'rxjs';

import { MOCK_WIZARD_ENTRY_RESPONSE } from '../../wizard/ngxs/wizard.mocks';
import { WizardEntryResponse } from '../../wizard/ngxs/wizard.model';
import { MOCK_ORGANIZATION_ACCOUNT } from '../organization/organization.mocks';
import { OrganizationAccount } from '../organization/organization.model';
import { OrganizationState } from '../organization/organization.state';

import { FetchEntries, FetchImpact } from './impact.actions';
import { ImpactService } from './impact.service';
import { ImpactState } from './impact.state';

const OLDEST: WizardEntryResponse = { ...MOCK_WIZARD_ENTRY_RESPONSE, lastUpdatedAt: '2022-01-01T00:00:00.000Z' };
const MIDDLE: WizardEntryResponse = { ...MOCK_WIZARD_ENTRY_RESPONSE, lastUpdatedAt: '2022-01-02T00:00:00.000Z' };
const NEWEST: WizardEntryResponse = { ...MOCK_WIZARD_ENTRY_RESPONSE, lastUpdatedAt: '2022-01-03T00:00:00.000Z' };

describe('ImpactService', () => {
  let dispatch: jest.SpyInstance;
  let entries$: BehaviorSubject<WizardEntryResponse[]>;
  let entry$: BehaviorSubject<WizardEntryResponse | null>;
  let organization$: BehaviorSubject<OrganizationAccount | null>;
  let service: ImpactService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([], { developmentMode: true })],
    });

    const store = TestBed.inject(Store);
    dispatch = jest.spyOn(store, 'dispatch');

    entry$ = new BehaviorSubject<WizardEntryResponse | null>(null);
    entries$ = new BehaviorSubject([MIDDLE, OLDEST, NEWEST]);
    organization$ = new BehaviorSubject<OrganizationAccount | null>(null);

    jest.spyOn(store, 'select').mockImplementation((selector: unknown) => {
      switch (selector) {
        case OrganizationState.organization:
          return organization$;
        case ImpactState.entries:
          return entries$;
        case ImpactState.entry:
          return entry$;
        default:
          return new Observable();
      }
    });

    service = TestBed.inject(ImpactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch the last updated impact report for an organization', async () => {
    expect(dispatch).not.toHaveBeenCalled();

    organization$.next(MOCK_ORGANIZATION_ACCOUNT);
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith(new FetchEntries(MOCK_ORGANIZATION_ACCOUNT));
    expect(dispatch).toHaveBeenCalledWith(new FetchImpact(NEWEST));
  });

  it("shouldn't fetch the last updated impact report if one has already been fetched", async () => {
    expect(dispatch).not.toHaveBeenCalled();

    entry$.next(MIDDLE);
    organization$.next(MOCK_ORGANIZATION_ACCOUNT);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(new FetchEntries(MOCK_ORGANIZATION_ACCOUNT));
  });
});
