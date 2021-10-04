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

import { AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { merge, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

import { OrganizationAccount } from '../core/organization/organization.model';
import { getDateTime } from '../core/utils/dates.utils';
import { isNonNullable } from '../core/utils/rxjs.utils';

import {
  DeprecatedHasVehicles,
  ElectricityUsage,
  ExpenseUsage,
  Facilities,
  FuelUsage,
  HeatingType,
  HeatingUsage,
  MachineryUsage,
  ValueWithUnit,
  WizardEntry,
  YesNoUnknown,
} from './ngxs/wizard.model';

export type Expense = Omit<ExpenseUsage, 'spend'>;

const KWH_UNIT = 'kWh';
const LITRES_UNIT = 'l';

// Helpers

/** Creates a standard FormGroup, adding a little bit of extra typechecking for the constructor options. */
function createFormGroup<T>(controls: { [key in keyof T]: AbstractControl }, validator?: ValidatorFn): FormGroup {
  return new FormGroup(controls, { validators: validator });
}

/** Creates a value with unit form group and defaults the unit to the default currency. */
function createSpendFormGroup(organization: OrganizationAccount): { spend: FormGroup; spendValue: FormControl } {
  const { group, value } = createValueWithUnitFormGroup(organization.currency || 'EUR');
  return { spend: group, spendValue: value };
}

/** Creates a value with unit form group and defaults the unit to the provided value. */
function createValueWithUnitFormGroup(defaultUnitValue: unknown = null): {
  group: FormGroup;
  unit: FormControl;
  value: FormControl;
} {
  const value = new FormControl(null, { validators: Validators.min(0) });
  const unit = new FormControl(defaultUnitValue);
  const group = createFormGroup<ValueWithUnit>({ unit, value });
  return { group, unit, value };
}

/** Resets a control value to null (if it isn't already). */
function resetControls(...controls: FormControl[]) {
  for (const control of controls) {
    if (control.value !== null) control.setValue(null);
  }
}

/** Adds subscriptions to sync a YesNoUnknown control with it's associated value (eg. hasSpend and spend). */
function resetControlsOnChange(yesNoUnknownControl: FormControl, valueControl: FormControl): Subscription[] {
  return [
    yesNoUnknownControl.valueChanges
      .pipe(filter((value) => isNonNullable(value) && value !== YesNoUnknown.YES))
      .subscribe(() => resetControls(valueControl)),

    valueControl.valueChanges.pipe(map(isNonNullable), distinctUntilChanged()).subscribe((dataAdded) =>
      dataAdded
        ? // Ensure hasX is set when X data has been added
          yesNoUnknownControl.value !== YesNoUnknown.YES && yesNoUnknownControl.patchValue(YesNoUnknown.YES)
        : // Ensure hasX is not yes when X data has no value
          yesNoUnknownControl.value === YesNoUnknown.YES && yesNoUnknownControl.patchValue(null)
    ),
  ];
}

// Form groups

function createExpensesFormArray(organization: OrganizationAccount, expenseCategories: Expense[]): FormArray {
  return new FormArray(
    expenseCategories.map(({ description, normId }) =>
      createFormGroup<ExpenseUsage>({
        description: new FormControl(description),
        normId: new FormControl(normId),
        spend: createSpendFormGroup(organization).spend,
      })
    )
  );
}

function createElectricityUsageFormGroup(organization: OrganizationAccount, hasFacilities: FormControl): FormGroup {
  const hasRenewable = new FormControl();

  const hasEnergy = new FormControl();
  const { group: energy, unit: energyUnit, value: energyValue } = createValueWithUnitFormGroup();
  resetControlsOnChange(hasEnergy, energyValue);
  energyUnit.setValue(KWH_UNIT); // only option available

  const hasSpend = new FormControl();
  const { spend, spendValue } = createSpendFormGroup(organization);
  resetControlsOnChange(hasSpend, spendValue);

  // If no facilities, reset all electricity
  hasFacilities.valueChanges
    .pipe(filter((value) => value === YesNoUnknown.NO))
    .subscribe(() => resetControls(energyValue, hasRenewable, spendValue));

  // If energy data, reset spend
  energyValue.valueChanges.pipe(filter(isNonNullable)).subscribe(() => resetControls(spendValue));

  // If no spend data, reset renewable
  hasSpend.valueChanges.pipe(filter((value) => value === YesNoUnknown.NO)).subscribe(() => resetControls(hasRenewable));

  return createFormGroup<ElectricityUsage>({ energy, hasEnergy, hasRenewable, hasSpend, spend });
}

function createFacilitiesFormGroup(): { facilities: FormGroup; hasFacilities: FormControl } {
  const hasFacilities = new FormControl();
  const { group: size, value: sizeValue } = createValueWithUnitFormGroup('m^2');
  resetControlsOnChange(hasFacilities, sizeValue);

  return { facilities: createFormGroup<Facilities>({ hasFacilities, size }), hasFacilities };
}

function createFuelOrMachineryUsageFormGroup(
  organization: OrganizationAccount,
  hasXKey: 'hasMachinery' | 'hasVehicles'
): FormGroup {
  const hasX = new FormControl();

  const hasSpend = new FormControl();
  const { spend, spendValue } = createSpendFormGroup(organization);
  resetControlsOnChange(hasSpend, spendValue);

  const hasVolume = new FormControl();
  const { group: volume, unit: volumeUnit, value: volumeValue } = createValueWithUnitFormGroup();
  resetControlsOnChange(hasVolume, volumeValue);
  volumeUnit.setValue(LITRES_UNIT); // only option available

  // If no vehicles/machinery, reset spend & volume
  hasX.valueChanges
    .pipe(filter((value) => value === YesNoUnknown.NO))
    .subscribe(() => resetControls(spendValue, volumeValue));

  // If volume data, reset spend
  volumeValue.valueChanges.pipe(filter(isNonNullable)).subscribe(() => resetControls(spendValue));

  return createFormGroup<FuelUsage | MachineryUsage>({ hasSpend, hasVolume, [hasXKey]: hasX, spend, volume });
}

function createHeatingUsageFormGroup(organization: OrganizationAccount, hasFacilities: FormControl): FormGroup {
  const type = new FormControl();
  const includedWithElectricity = new FormControl();

  const hasEnergy = new FormControl();
  const { group: energy, unit: energyUnit, value: energyValue } = createValueWithUnitFormGroup();
  resetControlsOnChange(hasEnergy, energyValue);
  energyUnit.setValue(KWH_UNIT); // only option available

  const hasSpend = new FormControl();
  const { spend, spendValue } = createSpendFormGroup(organization);
  resetControlsOnChange(hasSpend, spendValue);

  // If the heating type is not electricity, reset included with electricity
  type.valueChanges
    .pipe(filter((value) => value !== HeatingType.ELECTRICITY))
    .subscribe(() => resetControls(includedWithElectricity));

  // If include with electricty, reset spend and energy
  includedWithElectricity.valueChanges
    .pipe(filter((value) => value === YesNoUnknown.YES))
    .subscribe(() => resetControls(energyValue, spendValue));

  // If energy data, reset spend
  energyValue.valueChanges.pipe(filter(isNonNullable)).subscribe(() => resetControls(spendValue));

  // Reset all heating data if no facilities/heating
  merge(
    hasFacilities.valueChanges.pipe(filter((value) => value === YesNoUnknown.NO)),
    type.valueChanges.pipe(filter((value) => value === HeatingType.NONE))
  ).subscribe(() => resetControls(energyValue, includedWithElectricity, spendValue));

  return createFormGroup<HeatingUsage>({ energy, hasEnergy, hasSpend, includedWithElectricity, spend, type });
}

function createTimePeriodFormGroup(): FormGroup {
  const startDate = new FormControl(null, { validators: Validators.required });
  const endDate = new FormControl();

  // Only allow the end date to be a year after the start
  endDate.disable();
  startDate.valueChanges.subscribe((value) => {
    const plusOneYear = getDateTime(value).plus({ day: -1, year: 1 }).toUTC();
    endDate.setValue(plusOneYear);
  });

  return createFormGroup<{ startDate: string; endDate: string }>({ startDate, endDate });
}

/** Creates (and sets defaults if present) a reactive form for a wizard entry. */
export function createWizardEntryForm(
  organization: OrganizationAccount,
  expenses: Expense[],
  entry?: WizardEntry
): FormGroup {
  const { facilities, hasFacilities } = createFacilitiesFormGroup();

  const form = createFormGroup<WizardEntry>({
    electricity: createElectricityUsageFormGroup(organization, hasFacilities),
    expenses: createExpensesFormArray(organization, expenses),
    facilities,
    fuel: createFuelOrMachineryUsageFormGroup(organization, 'hasVehicles'),
    heating: createHeatingUsageFormGroup(organization, hasFacilities),
    machinery: createFuelOrMachineryUsageFormGroup(organization, 'hasMachinery'),
    numberOfEmployees: new FormControl(null, { validators: Validators.min(0) }),
    revenue: createSpendFormGroup(organization).spend,
    spend: createSpendFormGroup(organization).spend,
    timePeriod: createTimePeriodFormGroup(),
  });

  if (entry) patchWizardEntryForm(form, entry, { emitEvent: false });
  return form;
}

/** Patches an entry to a form, ensuring the expenses array is updated correctly. */
export function patchWizardEntryForm(
  form: FormGroup,
  { expenses = [], ...entry }: Partial<WizardEntry>,
  options?: object // passed onto form.patchValue({}, options)
): void {
  // Question originally asked during spend now being asked at volume
  if (entry.fuel?.hasSpend === YesNoUnknown.NO) {
    entry = { ...entry, fuel: { ...entry.fuel, hasVolume: YesNoUnknown.NO, hasSpend: undefined } };
  }

  // Question originally asked in one go, now being asked separately
  switch (entry.fuel?.hasVehicles as unknown as DeprecatedHasVehicles) {
    case DeprecatedHasVehicles.YES_VEHICLES_ONLY:
      entry = {
        ...entry,
        fuel: { ...entry.fuel, hasVehicles: YesNoUnknown.YES },
        machinery: { hasMachinery: YesNoUnknown.NO },
      };
      break;
    case DeprecatedHasVehicles.YES_MACHINERY_ONLY:
      entry = {
        ...entry,
        fuel: { hasVehicles: YesNoUnknown.NO },
        machinery: { ...entry.fuel, hasMachinery: YesNoUnknown.YES },
      };
      break;
    default:
  }

  form.patchValue(entry, options);

  const formArray = form.get('expenses') as FormArray | null;
  for (const control of formArray?.controls ?? []) {
    const { normId } = control.value as ExpenseUsage;
    const value = expenses.find((expense) => expense.normId === normId);
    if (value) control.patchValue(value, options);
  }
}
