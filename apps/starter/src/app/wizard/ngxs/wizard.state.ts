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

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Action, State, StateContext, Selector, StateToken, Store } from '@ngxs/store';

import { catchError, mergeMap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { UpdateEntry } from '../../core/impact/impact.actions';
import { OrganizationState } from '../../core/organization/organization.state';

import {
  ClearWizardEntry,
  FetchWizardEntry,
  FetchWizardEntryFailed,
  FetchWizardEntrySucceeded,
  SaveWizardEntry,
  SaveWizardEntryDataFailed,
  SaveWizardEntrySucceeded,
} from './wizard.actions';
import { WizardEntry, WizardEntryResponse, WizardStateModel } from './wizard.model';
import { sanitizeWizardEntry } from './wizard.utils';

const WIZARD_STATE_TOKEN = new StateToken<WizardStateModel>('wizard');
const WIZARD_STATE_DEFAULTS: WizardStateModel = { error: null, response: null, saving: false };

@State({
  name: WIZARD_STATE_TOKEN,
  defaults: WIZARD_STATE_DEFAULTS,
})
@Injectable()
export class WizardState {
  @Selector([WizardState.response])
  static entry(state: WizardStateModel, response: WizardEntryResponse | null): WizardEntry | null {
    return response && response.rawClientState;
  }

  @Selector()
  static error(state: WizardStateModel): HttpErrorResponse | null {
    return state.error;
  }

  @Selector()
  static response(state: WizardStateModel): WizardEntryResponse | null {
    return state.response;
  }

  @Selector()
  static saving(state: WizardStateModel): boolean {
    return state.saving;
  }

  constructor(private http: HttpClient, private store: Store) {}

  @Action(ClearWizardEntry)
  clearWizardEntry(ctx: StateContext<WizardStateModel>) {
    return ctx.patchState({ response: null, error: null });
  }

  @Action(FetchWizardEntry)
  fetchWizardEntry(ctx: StateContext<WizardStateModel>, { id }: FetchWizardEntry) {
    ctx.dispatch(new ClearWizardEntry());

    const url = this.createEntryUrl(id);
    return this.http.get<WizardEntryResponse>(url).pipe(
      mergeMap((payload) => ctx.dispatch(new FetchWizardEntrySucceeded(payload))),
      catchError((error) => ctx.dispatch(new FetchWizardEntryFailed(error)))
    );
  }

  @Action(FetchWizardEntrySucceeded)
  fetchWizardEntrySucceeded(ctx: StateContext<WizardStateModel>, { payload }: FetchWizardEntrySucceeded) {
    ctx.patchState({ response: payload });
  }

  @Action(FetchWizardEntryFailed)
  fetchWizardEntryFailed(ctx: StateContext<WizardStateModel>, { payload }: FetchWizardEntryFailed) {
    ctx.patchState({ error: payload });
  }

  @Action(SaveWizardEntry)
  saveWizardEntry(ctx: StateContext<WizardStateModel>, { entry, id }: SaveWizardEntry) {
    ctx.patchState({ saving: true });

    return (
      id
        ? this.http.put<WizardEntryResponse>(this.createEntryUrl(id), sanitizeWizardEntry(entry))
        : this.http.post<WizardEntryResponse>(this.createEntryUrl(id), sanitizeWizardEntry(entry))
    ).pipe(
      mergeMap((payload) => ctx.dispatch(new SaveWizardEntrySucceeded(payload))),
      catchError((error) => ctx.dispatch(new SaveWizardEntryDataFailed(error)))
    );
  }

  @Action(SaveWizardEntrySucceeded)
  saveWizardEntrySucceeded(ctx: StateContext<WizardStateModel>, { payload }: SaveWizardEntrySucceeded) {
    return [ctx.dispatch(new UpdateEntry(payload)), ctx.patchState({ error: null, response: payload, saving: false })];
  }

  @Action(SaveWizardEntryDataFailed)
  saveWizardEntryDataFailed(ctx: StateContext<WizardStateModel>, { payload }: SaveWizardEntryDataFailed) {
    ctx.patchState({ error: payload, saving: false });
  }

  private createEntryUrl(id?: string | null) {
    const organization = this.store.selectSnapshot(OrganizationState.organization);
    if (!organization) throw new Error('No organization set in state.');

    return `${environment.NORMATIVE_DATA_UPLOAD_URL}/starter/${organization._id}/entries${id ? `/${id}` : ''}`;
  }
}
