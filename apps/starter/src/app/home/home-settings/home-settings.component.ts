import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { Select, Store } from '@ngxs/store';

import { combineLatest, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { FetchCountries, FetchSectors } from '../../core/data/data.actions';

import { Country, Sector } from '../../core/data/data.model';
import { DataState } from '../../core/data/data.state';
import { LoggingService } from '../../core/logging/logging.service';
import { ORGANIZATION_SETTINGS_LOGGING_CATEGORY } from '../../core/logging/logging.utils';
import { UpdateOrganization } from '../../core/organization/organization.actions';
import { OrganizationAccount } from '../../core/organization/organization.model';
import { OrganizationState } from '../../core/organization/organization.state';
import { isNonNullable } from '../../core/utils/rxjs.utils';

export const REQUEST_DATA_DELETION_EMAIL = 'bcc-data-management@normative.io';
export const REQUEST_DATA_DELETION_SUBJECT = 'Delete BCC account requested';

@Component({
  selector: 'n-home-settings',
  templateUrl: './home-settings.component.html',
  styleUrls: ['./home-settings.component.scss'],
})
export class HomeSettingsComponent implements OnDestroy, OnInit {
  @Select(OrganizationState.organization) private organization$!: Observable<OrganizationAccount | null>;

  @Select(DataState.countries) countryList$!: Observable<Country[]>;
  @Select(DataState.sectors) sectorList$!: Observable<Sector[]>;

  form = new FormGroup({
    country: new FormControl(null, Validators.required),
    sector: new FormControl(null, Validators.required),
  });

  requestDataDelectionUrl = `mailto:${REQUEST_DATA_DELETION_EMAIL}?subject=${encodeURIComponent(
    REQUEST_DATA_DELETION_SUBJECT
  )}`;

  private subscriptions: Subscription[] = [];

  constructor(
    private dialogRef: MatDialogRef<HomeSettingsComponent>,
    private loggingService: LoggingService,
    private store: Store
  ) {}

  ngOnInit() {
    this.store.dispatch([new FetchCountries(), new FetchSectors()]);

    const subscription = combineLatest([this.organization$, this.countryList$, this.sectorList$])
      .pipe(filter(([organization]) => isNonNullable(organization)))
      .subscribe(([organization, countryList, sectorList]) =>
        this.onOrganizationChange(organization as OrganizationAccount, countryList, sectorList)
      );

    this.subscriptions.push(subscription);
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    const {
      country: { iso2: country, currency },
      sector: { nace },
    } = this.form.value;

    const subscription = this.store
      .dispatch(new UpdateOrganization({ country, currency, nace }))
      .subscribe(() => this.close());

    this.loggingService.logEvent('SaveOrganizationSettings', { category: ORGANIZATION_SETTINGS_LOGGING_CATEGORY });

    this.subscriptions.push(subscription);
  }

  logRequestDataDeletion() {
    this.loggingService.logEvent('RequestDataDeletionClick', { category: ORGANIZATION_SETTINGS_LOGGING_CATEGORY });
  }

  private onOrganizationChange(organization: OrganizationAccount, countryList: Country[], sectorList: Sector[]) {
    const country = countryList.find(({ iso2 }) => iso2 === organization.country);
    const sector = sectorList.find(({ nace }) => `${nace}` === organization.nace);
    this.form.patchValue({ country, sector });
  }
}
