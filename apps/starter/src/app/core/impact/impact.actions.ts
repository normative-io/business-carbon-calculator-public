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
