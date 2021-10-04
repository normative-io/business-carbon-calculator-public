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
