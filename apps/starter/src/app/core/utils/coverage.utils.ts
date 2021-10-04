import { WizardEntry } from '../../wizard/ngxs/wizard.model';

export enum CoverageStatus {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',

  ERROR_MULTIPLE_CURRENCIES = 'ERROR_MULTIPLE_CURRENCIES',
  ERROR_NO_SPEND = 'ERROR_NO_SPEND',
}

const LOW_MAX = 30;
const MEDIUM_MAX = 80;

const COVERAGE_STATUS_WORDING: { [key in CoverageStatus]: string } = {
  [CoverageStatus.LOW]: 'Low',
  [CoverageStatus.MEDIUM]: 'Okay',
  [CoverageStatus.HIGH]: 'Great',

  [CoverageStatus.ERROR_MULTIPLE_CURRENCIES]: 'Not calculated',
  [CoverageStatus.ERROR_NO_SPEND]: 'Not calculated',
};

/** Returns the coverage status from the specified wizard data. */
export function getCoverageStatusFromEntry({ expenses, spend }: WizardEntry): CoverageStatus {
  // Unable to calculate coverage if the user hasn't provided their overall spend
  const totalSpend = spend?.value;
  if (!totalSpend) {
    return CoverageStatus.ERROR_NO_SPEND;
  }

  // Unable to calculate coverage if the user is dealing with multiple currencies
  const totalSpendUnit = spend?.unit;
  const isSingleCurrency =
    !expenses || expenses.every(({ spend: { value, unit } }) => !value || unit === totalSpendUnit);
  if (!isSingleCurrency) {
    return CoverageStatus.ERROR_MULTIPLE_CURRENCIES;
  }

  // Calculate coverage from totals
  const totalExpenses = expenses?.reduce((sum, expense) => sum + expense.spend.value, 0) || 0;
  return getCoverageStatusFromTotals(totalSpend, totalExpenses);
}

/** Returns the coverage status based on total spend and expenses (with the assumption of sharing a currency). */
export function getCoverageStatusFromTotals(totalSpend: number, totalExpenses: number): CoverageStatus {
  const percentage = getPercentage(totalExpenses, totalSpend);
  if (percentage <= LOW_MAX) return CoverageStatus.LOW;
  if (percentage <= MEDIUM_MAX) return CoverageStatus.MEDIUM;
  return CoverageStatus.HIGH;
}

/** Returns the user-facing word for the specified status. */
export function getCoverageStatusWording(status: CoverageStatus): string {
  return COVERAGE_STATUS_WORDING[status];
}

export function getPercentage(value: number, max: number, min = 0): number {
  return ((value - min) * 100) / (max - min);
}
