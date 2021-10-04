import { Injectable } from '@angular/core';

import { Select, Store } from '@ngxs/store';

import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { distinctUntilChanged, distinctUntilKeyChanged, filter, pluck } from 'rxjs/operators';

import { FetchOrganization } from '../organization/organization.actions';
import { isNonNullable } from '../utils/rxjs.utils';

import { FetchCurrentUser } from './user.actions';
import { OrganizationAccountSnapshot } from './user.model';
import { UserState } from './user.state';

@Injectable({ providedIn: 'root' })
export class UserService {
  @Select(UserState.organization) private organization$!: Observable<OrganizationAccountSnapshot | null>;

  constructor(private auth: AuthService, private store: Store) {
    // On authentication, fetch current user
    this.auth.user$
      .pipe(filter(isNonNullable), distinctUntilKeyChanged('_id'))
      .subscribe(() => this.store.dispatch(new FetchCurrentUser()));

    // On getting a user, fetch full organization
    this.organization$
      .pipe(filter(isNonNullable), pluck('_id'), distinctUntilChanged())
      .subscribe((id) => this.store.dispatch(new FetchOrganization(id)));
  }
}
