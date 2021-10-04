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

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Select, Store } from '@ngxs/store';

import { combineLatest, Observable, of } from 'rxjs';
import { filter, map, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

import { FetchCountries, FetchSectors } from '../core/data/data.actions';
import { Country, Sector } from '../core/data/data.model';
import { DataState } from '../core/data/data.state';

import { FetchImpact } from '../core/impact/impact.actions';
import { Impact } from '../core/impact/impact.model';
import { ImpactService } from '../core/impact/impact.service';
import { ImpactState } from '../core/impact/impact.state';
import { LoggingService } from '../core/logging/logging.service';
import { DASHBOARD_LOGGING_CATEGORY } from '../core/logging/logging.utils';

import { OrganizationAccount } from '../core/organization/organization.model';
import { OrganizationState } from '../core/organization/organization.state';
import { User } from '../core/user/user.model';
import { UserState } from '../core/user/user.state';
import { isNonNullable } from '../core/utils/rxjs.utils';
import { WizardEntryResponse } from '../wizard/ngxs/wizard.model';

import { HomeSettingsComponent } from './home-settings/home-settings.component';

@Component({
  selector: 'n-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  @Select(ImpactState.entry) entry$!: Observable<WizardEntryResponse | null>;
  @Select(ImpactState.entries) entries$!: Observable<WizardEntryResponse[]>;
  @Select(ImpactState.impact) impact$!: Observable<Impact | null>;
  @Select(UserState.user) user$!: Observable<User>;

  @Select(DataState.sectors) private sectorList$!: Observable<Sector[]>;
  @Select(DataState.countries) private countryList$!: Observable<Country[]>;
  @Select(OrganizationState.organization) private organizationOrNull$!: Observable<OrganizationAccount | null>;

  country$?: Observable<string>;
  organization$?: Observable<OrganizationAccount>;
  sector$?: Observable<string>;
  showImpact$?: Observable<boolean>;

  constructor(
    // On initialization, this fetches the latest impact
    private impactService: ImpactService,
    private loggingService: LoggingService,
    private matDialog: MatDialog,
    private store: Store
  ) {}

  ngOnInit() {
    this.store.dispatch([new FetchCountries(), new FetchSectors()]);

    // Filter organization from state once set
    this.organization$ = this.organizationOrNull$.pipe(filter(isNonNullable));

    // Retrieve company name from organization/list
    this.country$ = combineLatest([this.organization$, this.countryList$]).pipe(
      map(([organization, countries]) => countries.find(({ iso2 }) => iso2 === organization.country)),
      map((country) => country?.name || '')
    );

    // Retrieve sector name from organization/list
    this.sector$ = combineLatest([this.organization$, this.sectorList$]).pipe(
      map(([organization, sectors]) => sectors.find(({ nace }) => nace === organization.nace)),
      map((sector) => sector?.name || '')
    );

    // Determine whether or not to show the graph
    this.showImpact$ = this.entry$.pipe(
      filter(isNonNullable),
      map((entry) => Boolean(entry.dataSources.length)),
      tap((showImpact) =>
        showImpact
          ? this.loggingService.logEvent('DashboardEmissionsPopulated', { category: DASHBOARD_LOGGING_CATEGORY })
          : this.loggingService.logEvent('DashboardEmissionsEmpty', { category: DASHBOARD_LOGGING_CATEGORY })
      ),

      shareReplay(),
      startWith(false),
      switchMap((showImpact) => (showImpact ? this.impact$.pipe(map(Boolean)) : of(false)))
    );
  }

  onEntryChange(entry: WizardEntryResponse) {
    this.store.dispatch(new FetchImpact(entry));
  }

  onSettingsClick() {
    this.matDialog.open(HomeSettingsComponent);
  }

  logClick(eventName: string) {
    this.loggingService.logEvent(eventName, { category: DASHBOARD_LOGGING_CATEGORY });
  }
}
