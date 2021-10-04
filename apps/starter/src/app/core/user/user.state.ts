import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';

import { DateTime } from 'luxon';
import { catchError, mergeMap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { OrganizationAccountType } from '../organization/organization.model';
import { getDateTime } from '../utils/dates.utils';

import {
  AcceptTerms,
  AcceptTermsFailed,
  AcceptTermsSucceeded,
  FetchCurrentUser,
  FetchCurrentUserFailed,
  FetchCurrentUserSucceeded,
} from './user.actions';
import { OrganizationAccountSnapshot, User, UserStateModel } from './user.model';

const USER_STATE_TOKEN = new StateToken<UserStateModel>('user');
const USER_STATE_DEFAULTS: UserStateModel = { error: null, user: null };

/** The time we last updated our T&Cs (used to re-ask acceptence). */
export const LAST_UPDATED_TERMS = DateTime.utc(2022, 3, 15);

@State({
  name: USER_STATE_TOKEN,
  defaults: USER_STATE_DEFAULTS,
})
@Injectable()
export class UserState {
  @Selector()
  static user(state: UserStateModel): User | null {
    return state.user;
  }

  @Selector([UserState.user])
  static organization(state: UserStateModel, user: User | null): OrganizationAccountSnapshot | null {
    return (
      user?.organizationAccounts.find(({ accountType }) => accountType === OrganizationAccountType.STARTER) || null
    );
  }

  @Selector([UserState.user])
  static acceptedTerms(state: UserStateModel, user: User | null): boolean {
    return user?.bccTerms ? getDateTime(user.bccTerms) >= LAST_UPDATED_TERMS : false;
  }

  constructor(private http: HttpClient) {}

  @Action(FetchCurrentUser)
  fetchCurrentUser(ctx: StateContext<UserStateModel>) {
    return this.http.get<User>(`${environment.NORMATIVE_AUTH_URL}/users/me`).pipe(
      mergeMap((user) => ctx.dispatch(new FetchCurrentUserSucceeded(user))),
      catchError((error) => ctx.dispatch(new FetchCurrentUserFailed(error)))
    );
  }

  @Action(FetchCurrentUserSucceeded)
  fetchCurrentUserSucceeded(ctx: StateContext<UserStateModel>, { payload }: FetchCurrentUserSucceeded) {
    return ctx.patchState({ user: payload });
  }

  @Action(FetchCurrentUserFailed)
  fetchCurrentUserFailed(ctx: StateContext<UserStateModel>, { payload }: FetchCurrentUserFailed) {
    return ctx.patchState({ error: payload });
  }

  @Action(AcceptTerms)
  acceptTerms(ctx: StateContext<UserStateModel>, { bccTerms }: AcceptTerms) {
    const id = ctx.getState().user?._id || ''; // User will always exist at this point
    const url = `${environment.NORMATIVE_AUTH_URL}/users/${id}/bccTerms`;

    return this.http.put<User>(url, { bccTerms }).pipe(
      mergeMap((user) => ctx.dispatch(new AcceptTermsSucceeded(user))),
      catchError((error) => ctx.dispatch(new AcceptTermsFailed(error)))
    );
  }

  @Action(AcceptTermsSucceeded)
  acceptTermsSucceeded(ctx: StateContext<UserStateModel>, { payload }: AcceptTermsSucceeded) {
    return ctx.patchState({ user: { ...ctx.getState().user, ...payload } });
  }

  @Action(AcceptTermsFailed)
  AcceptTermsFailed(ctx: StateContext<UserStateModel>, { payload }: AcceptTermsFailed) {
    return ctx.patchState({ error: payload });
  }
}
