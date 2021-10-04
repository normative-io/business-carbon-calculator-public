import { HttpErrorResponse } from '@angular/common/http';

import { WizardEntryResponse } from '../../wizard/ngxs/wizard.model';
import { OrganizationAccount } from '../organization/organization.model';

import { Impact } from './impact.model';

const FETCH_ENTRIES = '[Impact] FetchEntries';
const FETCH_ENTRIES_SUCCEEDED = '[Impact] FetchEntriesSucceeded';
const FETCH_ENTRIES_FAILED = '[Impact] FetchEntriesFailed';

const UPDATE_ENTRY = '[Impact] UpdateEntry';

const FETCH_IMPACT = '[Impact] FetchImpact';
const FETCH_IMPACT_STARTED = '[Impact] FetchImpactStarted';
const FETCH_IMPACT_SUCCEEDED = '[Impact] FetchImpactSucceeded';
const FETCH_IMPACT_FAILED = '[Impact] FetchImpactFailed';

export class FetchEntries {
  static readonly type = FETCH_ENTRIES;
  constructor(public organization: OrganizationAccount) {}
}

export class FetchEntriesSucceeded {
  static readonly type = FETCH_ENTRIES_SUCCEEDED;
  constructor(public payload: WizardEntryResponse[]) {}
}

export class FetchEntriesFailed {
  static readonly type = FETCH_ENTRIES_FAILED;
  constructor(public payload: HttpErrorResponse) {}
}

export class UpdateEntry {
  static readonly type = UPDATE_ENTRY;
  constructor(public entry: WizardEntryResponse) {}
}

export class FetchImpact {
  static readonly type = FETCH_IMPACT;
  constructor(public entry: WizardEntryResponse) {}
}

export class FetchImpactStarted {
  static readonly type = FETCH_IMPACT_STARTED;
  constructor(public entry: WizardEntryResponse) {}
}

export class FetchImpactSucceeded {
  static readonly type = FETCH_IMPACT_SUCCEEDED;
  constructor(public payload: Impact) {}
}

export class FetchImpactFailed {
  static readonly type = FETCH_IMPACT_FAILED;
  constructor(public payload: HttpErrorResponse) {}
}
