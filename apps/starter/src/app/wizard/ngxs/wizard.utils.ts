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

import { isNonNullable } from '../../core/utils/rxjs.utils';

import {
  ElectricityUsage,
  Facilities,
  FuelUsage,
  HeatingUsage,
  MachineryUsage,
  ValueWithUnit,
  WizardEntry,
} from './wizard.model';

/** Returns the object with any nullish or empty objects removed. */
function removeEmptyValues<T extends object>(object: T): T {
  return Object.entries(object)
    .filter(([_, value]) => isNonNullable(value) && (typeof value !== 'object' || Object.keys(value).length > 0))
    .reduce((filtered, [key, value]) => ({ ...filtered, [key]: value }), {} as T);
}

/** Returns the object if containing a number, otherwise undefined. */
function getValueWithUnit(valueWithUnit: ValueWithUnit | undefined): ValueWithUnit | undefined {
  return valueWithUnit && typeof valueWithUnit.value === 'number' ? valueWithUnit : undefined;
}

/** Filters out any unwanted on invalid nullish data (left over from Angular forms). */
export function sanitizeWizardEntry(entry: WizardEntry): WizardEntry {
  const { electricity, expenses, facilities, fuel, heating, machinery, revenue, spend, ...rest } = entry;
  return removeEmptyValues<WizardEntry>({
    ...rest,
    electricity: removeEmptyValues<ElectricityUsage>({
      ...electricity,
      energy: getValueWithUnit(electricity?.energy),
      spend: getValueWithUnit(electricity?.spend),
    }),
    expenses: expenses?.filter((expense) => isNonNullable(expense.spend?.value)),
    facilities: removeEmptyValues<Facilities>({ ...facilities, size: getValueWithUnit(facilities?.size) }),
    fuel: removeEmptyValues<FuelUsage>({
      ...fuel,
      spend: getValueWithUnit(fuel?.spend),
      volume: getValueWithUnit(fuel?.volume),
    }),
    heating: removeEmptyValues<HeatingUsage>({
      ...heating,
      energy: getValueWithUnit(heating?.energy),
      spend: getValueWithUnit(heating?.spend),
    }),
    machinery: removeEmptyValues<MachineryUsage>({
      ...machinery,
      spend: getValueWithUnit(machinery?.spend),
      volume: getValueWithUnit(machinery?.volume),
    }),
    revenue: getValueWithUnit(revenue),
    spend: getValueWithUnit(spend),
  });
}
