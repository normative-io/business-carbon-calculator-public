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

import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';

import { from } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

import {
  FetchCountries,
  FetchCountriesFailed,
  FetchCountriesSucceeded,
  FetchSectors,
  FetchSectorsFailed,
  FetchSectorsSucceeded,
} from './data.actions';
import { Country, DataStateModel, Sector } from './data.model';

const DATA_STATE_TOKEN = new StateToken<DataStateModel>('data');
const DATA_STATE_DEFAULTS: DataStateModel = { countries: [], error: null, sectors: [] };

@State({
  name: DATA_STATE_TOKEN,
  defaults: DATA_STATE_DEFAULTS,
})
@Injectable()
export class DataState {
  @Selector()
  static countries(state: DataStateModel): Country[] {
    return state.countries;
  }

  @Selector()
  static sectors(state: DataStateModel): Sector[] {
    return state.sectors;
  }

  @Action(FetchCountries)
  fetchCountries(ctx: StateContext<DataStateModel>) {
    return from(import('./countries.data')).pipe(
      mergeMap((m) => ctx.dispatch(new FetchCountriesSucceeded(m.COUNTRIES))),
      catchError((error) => ctx.dispatch(new FetchCountriesFailed(error)))
    );
  }

  @Action(FetchCountriesSucceeded)
  fetchCountriesSucceeded(ctx: StateContext<DataStateModel>, { payload }: FetchCountriesSucceeded) {
    return ctx.patchState({ countries: payload });
  }

  @Action(FetchCountriesFailed)
  fetchCountriesFailed(ctx: StateContext<DataStateModel>, { payload }: FetchCountriesFailed) {
    return ctx.patchState({ error: payload });
  }

  @Action(FetchSectors)
  fetchSectors(ctx: StateContext<DataStateModel>) {
    return from(import('./sectors.data')).pipe(
      mergeMap((m) => ctx.dispatch(new FetchSectorsSucceeded(m.SECTORS))),
      catchError((error) => ctx.dispatch(new FetchSectorsFailed(error)))
    );
  }

  @Action(FetchSectorsSucceeded)
  fetchSectorsSucceeded(ctx: StateContext<DataStateModel>, { payload }: FetchSectorsSucceeded) {
    return ctx.patchState({ sectors: payload });
  }

  @Action(FetchSectorsFailed)
  fetchSectorsFailed(ctx: StateContext<DataStateModel>, { payload }: FetchSectorsFailed) {
    return ctx.patchState({ error: payload });
  }
}
