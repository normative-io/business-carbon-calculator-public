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

import { FetchCountries, FetchCountriesSucceeded, FetchSectors, FetchSectorsSucceeded } from './data.actions';
import { MOCK_COUNTRIES, MOCK_SECTORS } from './data.mocks';
import { DataState } from './data.state';

jest.mock('./countries.data', () => ({ COUNTRIES: MOCK_COUNTRIES }));
jest.mock('./sectors.data', () => ({ SECTORS: MOCK_SECTORS }));

describe('DataState', () => {
  let store: Store;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NgxsModule.forRoot([DataState], { developmentMode: true })],
    });

    store = TestBed.inject(Store);
  });

  it('should fetch the countries from the constants file', async () => {
    await store.dispatch(new FetchCountries()).toPromise();

    const state = store.selectSnapshot(DataState);
    expect(state).toHaveProperty('countries', MOCK_COUNTRIES);
  });

  it('should fetch the sectors from the constants file', async () => {
    await store.dispatch(new FetchSectors()).toPromise();

    const state = store.selectSnapshot(DataState);
    expect(state).toHaveProperty('sectors', MOCK_SECTORS);
  });

  describe('countries', () => {
    it('should return the countries', () => {
      store.dispatch(new FetchCountriesSucceeded(MOCK_COUNTRIES));
      const organization = store.selectSnapshot(DataState.countries);
      expect(organization).toEqual(MOCK_COUNTRIES);
    });
  });

  describe('sectors', () => {
    it('should return the sectors', () => {
      store.dispatch(new FetchSectorsSucceeded(MOCK_SECTORS));
      const organization = store.selectSnapshot(DataState.sectors);
      expect(organization).toEqual(MOCK_SECTORS);
    });
  });
});
