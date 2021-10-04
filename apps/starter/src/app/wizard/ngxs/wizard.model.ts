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

export enum YesNoUnknown {
  YES = 'YES',
  NO = 'NO',
  UNKNOWN = 'UNKNOWN',
}

export enum HeatingType {
  DISTRICT = 'DISTRICT',
  NATURAL_GAS = 'NATURAL GAS',
  ELECTRICITY = 'ELECTRICITY',
  OTHER = 'OTHER',
  NONE = 'NONE',
  UNKNOWN = 'UNKNOWN',
}

export enum DeprecatedHasVehicles {
  YES = 'YES',
  YES_VEHICLES_ONLY = 'YES_VEHICLES_ONLY',
  YES_MACHINERY_ONLY = 'YES_MACHINERY_ONLY',
  NO = 'NO',
  UNKNOWN = 'UNKNOWN',
}

export interface ValueWithUnit {
  value: number;
  unit: string;
}

export interface ElectricityUsage {
  energy?: ValueWithUnit;
  hasEnergy?: YesNoUnknown;
  hasRenewable?: YesNoUnknown;
  hasSpend?: YesNoUnknown;
  spend?: ValueWithUnit;
}

export interface Facilities {
  hasFacilities?: YesNoUnknown;
  size?: ValueWithUnit;
}

interface SpendAndVolume {
  hasSpend?: YesNoUnknown;
  hasVolume?: YesNoUnknown;
  spend?: ValueWithUnit;
  volume?: ValueWithUnit;
}

export interface FuelUsage extends SpendAndVolume {
  hasVehicles?: YesNoUnknown;
}

export interface HeatingUsage {
  energy?: ValueWithUnit;
  hasEnergy?: YesNoUnknown;
  hasSpend?: YesNoUnknown;
  includedWithElectricity?: YesNoUnknown;
  spend?: ValueWithUnit;
  type?: HeatingType;
}

export interface ExpenseUsage {
  description?: string;
  normId?: string;
  spend: ValueWithUnit;
}

export interface MachineryUsage extends SpendAndVolume {
  hasMachinery?: YesNoUnknown;
}

export interface TimePeriod {
  startDate: string;
  endDate: string;
}

export interface WizardEntry {
  timePeriod: TimePeriod;
  numberOfEmployees?: number;
  spend?: ValueWithUnit;
  revenue?: ValueWithUnit;

  electricity?: ElectricityUsage;
  facilities?: Facilities;
  fuel?: FuelUsage;
  heating?: HeatingUsage;
  machinery?: MachineryUsage;
  expenses?: ExpenseUsage[];
}

export interface WizardEntryResponse {
  _id: string;
  createdAt: string;
  lastUpdatedAt: string;
  organizationId: string;
  coveredPeriod: TimePeriod;
  dataSources: string[];
  rawClientState: WizardEntry;
}

export interface WizardStateModel {
  error: HttpErrorResponse | null;
  response: WizardEntryResponse | null;
  saving: boolean;
}
