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
