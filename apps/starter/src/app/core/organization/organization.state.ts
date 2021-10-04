import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';

import { catchError, mergeMap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import {
  CreateOrganization,
  CreateOrganizationFailed,
  CreateOrganizationSucceeded,
  FetchOrganization,
  FetchOrganizationFailed,
  FetchOrganizationSucceeded,
  UpdateOrganization,
  UpdateOrganizationFailed,
  UpdateOrganizationSucceeded,
} from './organization.actions';
import { OrganizationAccount, OrganizationAccountType, OrganizationStateModel } from './organization.model';

const ORGANIZATION_STATE_TOKEN = new StateToken<OrganizationStateModel>('organization');
const ORGANIZATION_STATE_DEFAULTS: OrganizationStateModel = { error: null, organization: null };

@State({
  name: ORGANIZATION_STATE_TOKEN,
  defaults: ORGANIZATION_STATE_DEFAULTS,
})
@Injectable()
export class OrganizationState {
  @Selector()
  static organization(state: OrganizationStateModel): OrganizationAccount | null {
    return state.organization;
  }

  constructor(private http: HttpClient) {}

  @Action(CreateOrganization)
  createOrganization(ctx: StateContext<OrganizationStateModel>, { payload }: CreateOrganization) {
    const url = this.getOrganizationAccountsUrl();
    const body = { ...payload, accountType: OrganizationAccountType.STARTER };

    return this.http.post<OrganizationAccount>(url, body).pipe(
      mergeMap((organization) => ctx.dispatch(new CreateOrganizationSucceeded(organization))),
      catchError((error) => ctx.dispatch(new CreateOrganizationFailed(error)))
    );
  }

  @Action(CreateOrganizationSucceeded)
  createOrganizationSucceeded(ctx: StateContext<OrganizationStateModel>, { payload }: CreateOrganizationSucceeded) {
    return ctx.patchState({ organization: payload });
  }

  @Action(CreateOrganizationFailed)
  createOrganizationFailed(ctx: StateContext<OrganizationStateModel>, { payload }: CreateOrganizationFailed) {
    return ctx.patchState({ error: payload });
  }

  @Action(FetchOrganization)
  fetchOrganization(ctx: StateContext<OrganizationStateModel>, { id }: FetchOrganization) {
    const url = this.getOrganizationAccountsUrl(id);
    return this.http.get<OrganizationAccount>(url).pipe(
      mergeMap((organization) => ctx.dispatch(new FetchOrganizationSucceeded(organization))),
      catchError((error) => ctx.dispatch(new FetchOrganizationFailed(error)))
    );
  }

  @Action(FetchOrganizationSucceeded)
  fetchOrganizationSucceeded(ctx: StateContext<OrganizationStateModel>, { payload }: FetchOrganizationSucceeded) {
    return ctx.patchState({ organization: payload });
  }

  @Action(FetchOrganizationFailed)
  fetchOrganizationFailed(ctx: StateContext<OrganizationStateModel>, { payload }: FetchOrganizationFailed) {
    return ctx.patchState({ error: payload });
  }

  @Action(UpdateOrganization)
  updateOrganization(ctx: StateContext<OrganizationStateModel>, { organization }: UpdateOrganization) {
    const id = OrganizationState.organization(ctx.getState())?._id;
    const url = `${this.getOrganizationAccountsUrl(id)}/details`;

    return this.http.put<OrganizationAccount>(url, organization).pipe(
      mergeMap((payload) => ctx.dispatch(new UpdateOrganizationSucceeded(payload))),
      catchError((error) => ctx.dispatch(new UpdateOrganizationFailed(error)))
    );
  }

  @Action(UpdateOrganizationSucceeded)
  updateOrganizationSucceeded(ctx: StateContext<OrganizationStateModel>, { payload }: UpdateOrganizationSucceeded) {
    return ctx.patchState({ error: null, organization: payload });
  }

  @Action(UpdateOrganizationFailed)
  updateOrganizationFailed(ctx: StateContext<OrganizationStateModel>, { payload }: UpdateOrganizationFailed) {
    return ctx.patchState({ error: payload });
  }

  private getOrganizationAccountsUrl(id?: string) {
    return `${environment.NORMATIVE_AUTH_URL}/organizationAccounts${id ? `/${id}` : ''}`;
  }
}
