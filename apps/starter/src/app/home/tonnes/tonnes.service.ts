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

import { formatNumber } from '../../core/utils/number.utils';

const NUMBER_FORMAT_OPTIONS: Intl.NumberFormatOptions = {
  maximumSignificantDigits: 3,
  maximumFractionDigits: 0,
};

@Injectable({ providedIn: 'root' })
export class TonnesService {
  toTonnes(kgCO2: number): number {
    return kgCO2 / 1000;
  }

  format(tCO2: number): string {
    return formatNumber(tCO2, NUMBER_FORMAT_OPTIONS);
  }
}
