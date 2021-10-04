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
