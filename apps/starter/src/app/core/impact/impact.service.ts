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

import { Select, Store } from '@ngxs/store';

import { combineLatest, Observable, of } from 'rxjs';
import { distinctUntilKeyChanged, filter, map, switchMap, take } from 'rxjs/operators';

import { WizardEntryResponse } from '../../wizard/ngxs/wizard.model';
import { OrganizationAccount } from '../organization/organization.model';
import { OrganizationState } from '../organization/organization.state';
import { isNonNullable } from '../utils/rxjs.utils';

import { FetchEntries, FetchImpact } from './impact.actions';
import { ImpactState } from './impact.state';

@Injectable({ providedIn: 'root' })
export class ImpactService {
  @Select(OrganizationState.organization) organization$!: Observable<OrganizationAccount | null>;
  @Select(ImpactState.entries) entries$!: Observable<WizardEntryResponse[]>;
  @Select(ImpactState.entry) entry$!: Observable<WizardEntryResponse | null>;

  constructor(private store: Store) {
    this.organization$
      .pipe(
        // Fetch all entries for an organization
        filter(isNonNullable),
        distinctUntilKeyChanged('_id'),
        switchMap((organization) => this.store.dispatch(new FetchEntries(organization))),
        switchMap(() => combineLatest([this.entries$, this.entry$]).pipe(take(1))),

        // Fetch impact for the latest entry (if a valid entry has not already been fetched)
        map(([entries, entry]) =>
          !entry || !entries.find(({ _id: id }) => id === entry._id) ? getLatest(entries) : null
        ),
        switchMap((entry) => (entry ? this.store.dispatch(new FetchImpact(entry)) : of(null)))
      )
      .subscribe();
  }
}

function getLatest(entries: WizardEntryResponse[]): WizardEntryResponse | null {
  const sorted = [...entries].sort(({ lastUpdatedAt: a }, { lastUpdatedAt: b }) => b.localeCompare(a));
  return sorted[0] || null;
}
