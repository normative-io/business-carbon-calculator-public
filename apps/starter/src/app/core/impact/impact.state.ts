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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';

import { of } from 'rxjs';
import { catchError, delay, filter, mergeMap, repeatWhen, switchMap, take } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { WizardEntryResponse } from '../../wizard/ngxs/wizard.model';

import {
  FetchEntries,
  FetchEntriesFailed,
  FetchEntriesSucceeded,
  FetchImpact,
  FetchImpactFailed,
  FetchImpactStarted,
  FetchImpactSucceeded,
  UpdateEntry,
} from './impact.actions';
import { Impact, ImpactStateModel } from './impact.model';

const IMPACT_STATE_TOKEN = new StateToken<ImpactStateModel>('impact');
const IMPACT_STATE_DEFAULTS: ImpactStateModel = { error: null, entries: [], id: null, impacts: [] };

@State({
  name: IMPACT_STATE_TOKEN,
  defaults: IMPACT_STATE_DEFAULTS,
})
@Injectable()
export class ImpactState {
  @Selector([ImpactState.entries])
  static entry(state: ImpactStateModel, entries: WizardEntryResponse[]): WizardEntryResponse | null {
    return entries.find(({ _id: id }) => id === state.id) || null;
  }

  @Selector()
  static entries(state: ImpactStateModel): WizardEntryResponse[] {
    // Sort by newest first
    return [...state.entries].sort((a, b) => b.coveredPeriod.startDate.localeCompare(a.coveredPeriod.startDate));
  }

  @Selector([ImpactState.entry])
  static impact(state: ImpactStateModel, entry: WizardEntryResponse | null): Impact | null {
    return (entry && state.impacts.find(({ starterEntryId }) => starterEntryId === entry._id)) || null;
  }

  constructor(private http: HttpClient) {}

  @Action(FetchEntries)
  fetchEntries(ctx: StateContext<ImpactStateModel>, { organization }: FetchEntries) {
    const url = this.getBaseUrl(organization._id);
    return this.http.get<WizardEntryResponse[]>(url).pipe(
      mergeMap((user) => ctx.dispatch(new FetchEntriesSucceeded(user))),
      catchError((error) => ctx.dispatch(new FetchEntriesFailed(error)))
    );
  }

  @Action(FetchEntriesSucceeded)
  fetchEntriesSucceeded(ctx: StateContext<ImpactStateModel>, { payload }: FetchEntriesSucceeded) {
    return this.setEntries(ctx, payload);
  }

  @Action(FetchEntriesFailed)
  fetchEntriesFailed(ctx: StateContext<ImpactStateModel>, { payload }: FetchEntriesFailed) {
    return ctx.patchState({ error: payload });
  }

  @Action(UpdateEntry)
  updateEntry(ctx: StateContext<ImpactStateModel>, { entry }: UpdateEntry) {
    return this.setEntries(ctx, [...ctx.getState().entries, entry]);
  }

  @Action(FetchImpact)
  fetchImpact(ctx: StateContext<ImpactStateModel>, { entry }: FetchImpact) {
    ctx.dispatch(new FetchImpactStarted(entry));

    const url = `${this.getBaseUrl(entry.organizationId)}/${entry._id}/impact`;
    return of(null).pipe(
      // Poll until calculations are complete
      switchMap(() => this.http.get<Impact>(url)),
      repeatWhen((obs) => obs.pipe(delay(1000))),
      filter(({ calculationComplete }) => calculationComplete),
      take(1),

      // Update state with final calculation/error
      mergeMap((impact) => ctx.dispatch(new FetchImpactSucceeded(impact))),
      catchError((error) => ctx.dispatch(new FetchImpactFailed(error)))
    );
  }

  @Action(FetchImpactStarted)
  fetchImpactStarted(ctx: StateContext<ImpactStateModel>, { entry }: FetchImpactStarted) {
    return [ctx.dispatch(new UpdateEntry(entry)), ctx.patchState({ id: entry._id })];
  }

  @Action(FetchImpactSucceeded)
  fetchImpactSucceeded(ctx: StateContext<ImpactStateModel>, { payload }: FetchImpactSucceeded) {
    // Remove previously fetched impacts in favour of payload
    const filtered = ctx.getState().impacts.filter(({ starterEntryId }) => starterEntryId !== payload.starterEntryId);
    return ctx.patchState({ impacts: [payload, ...filtered] });
  }

  @Action(FetchImpactFailed)
  fetchImpactFailed(ctx: StateContext<ImpactStateModel>, { payload }: FetchImpactFailed) {
    return ctx.patchState({ error: payload });
  }

  private getBaseUrl(organizationId: string): string {
    return `${environment.NORMATIVE_DATA_UPLOAD_URL}/starter/${organizationId}/entries`;
  }

  private setEntries(ctx: StateContext<ImpactStateModel>, entries: WizardEntryResponse[]) {
    // Ensure no duplicates (and keep the last edited)
    const unique = [...entries]
      .sort(({ lastUpdatedAt: a }, { lastUpdatedAt: b }) => b.localeCompare(a))
      .filter((entry, index, all) => all.findIndex(({ _id: id }) => id === entry._id) === index);

    return ctx.patchState({ entries: unique });
  }
}
