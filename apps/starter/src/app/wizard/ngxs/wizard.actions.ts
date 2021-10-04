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

import { WizardEntry, WizardEntryResponse } from './wizard.model';

const CLEAR_WIZARD_ENTRY = '[Wizard] ClearWizardEntry';

const FETCH_WIZARD_ENTRY = '[Wizard] FetchWizardEntry';
const FETCH_WIZARD_ENTRY_SUCCEEDED = '[Wizard] FetchWizardEntrySucceeded';
const FETCH_WIZARD_ENTRY_FAILED = '[Wizard] FetchWizardEntryFailed';

const SAVE_WIZARD_ENTRY = '[Wizard]: SaveWizardEntry';
const SAVE_WIZARD_ENTRY_SUCCEEDED = '[Wizard] SaveWizardEntrySucceeded';
const SAVE_WIZARD_ENTRY_FAILED = '[Wizard] SaveWizardEntryFailed';

export class ClearWizardEntry {
  static readonly type = CLEAR_WIZARD_ENTRY;
}

export class FetchWizardEntry {
  static readonly type = FETCH_WIZARD_ENTRY;
  constructor(public id: string | null) {}
}

export class FetchWizardEntrySucceeded {
  static readonly type = FETCH_WIZARD_ENTRY_SUCCEEDED;
  constructor(public payload: WizardEntryResponse) {}
}

export class FetchWizardEntryFailed {
  static readonly type = FETCH_WIZARD_ENTRY_FAILED;
  constructor(public payload: HttpErrorResponse) {}
}

export class SaveWizardEntry {
  static readonly type = SAVE_WIZARD_ENTRY;
  constructor(public entry: WizardEntry, public id: string | null = null) {}
}

export class SaveWizardEntrySucceeded {
  static readonly type = SAVE_WIZARD_ENTRY_SUCCEEDED;
  constructor(public payload: WizardEntryResponse) {}
}

export class SaveWizardEntryDataFailed {
  static readonly type = SAVE_WIZARD_ENTRY_FAILED;
  constructor(public payload: HttpErrorResponse) {}
}
