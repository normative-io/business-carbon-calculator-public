import {
  MOCK_HIGH_COVERAGE_WIZARD_ENTRY,
  MOCK_MIXED_CURRENCY_WIZARD_ENTRY,
  MOCK_MEDIUM_COVERAGE_WIZARD_ENTRY,
  MOCK_LOW_COVERAGE_WIZARD_ENTRY,
  MOCK_WIZARD_ENTRY,
} from '../../wizard/ngxs/wizard.mocks';

import {
  CoverageStatus,
  getCoverageStatusFromEntry,
  getCoverageStatusFromTotals,
  getPercentage,
} from './coverage.utils';

describe('getCoverageStatusFromEntry', () => {
  it('should return an error status if there is no spend set', () => {
    expect(getCoverageStatusFromEntry(MOCK_WIZARD_ENTRY)).toEqual(CoverageStatus.ERROR_NO_SPEND);
  });

  it('should return an error status if there are multiple currencies', () => {
    expect(getCoverageStatusFromEntry(MOCK_MIXED_CURRENCY_WIZARD_ENTRY)).toEqual(
      CoverageStatus.ERROR_MULTIPLE_CURRENCIES
    );
  });

  it('should return low if total expenses are <= 30% of the total spend', () => {
    expect(getCoverageStatusFromEntry(MOCK_LOW_COVERAGE_WIZARD_ENTRY)).toEqual(CoverageStatus.LOW);
  });

  it('should return medium if total expenses are > 30% and <= 80% of the total spend', () => {
    expect(getCoverageStatusFromEntry(MOCK_MEDIUM_COVERAGE_WIZARD_ENTRY)).toEqual(CoverageStatus.MEDIUM);
  });

  it('should return high if total expenses are > 80% of the total spend', () => {
    expect(getCoverageStatusFromEntry(MOCK_HIGH_COVERAGE_WIZARD_ENTRY)).toEqual(CoverageStatus.HIGH);
  });
});

describe('getCoverageStatusFromTotals', () => {
  it('should return low if total expenses are <= 30% of the total spend', () => {
    expect(getCoverageStatusFromTotals(1000, 0)).toEqual(CoverageStatus.LOW);
    expect(getCoverageStatusFromTotals(1000, 200)).toEqual(CoverageStatus.LOW);
    expect(getCoverageStatusFromTotals(1000, 300)).toEqual(CoverageStatus.LOW);
  });

  it('should return medium if total expenses are > 30% and <= 80% of the total spend', () => {
    expect(getCoverageStatusFromTotals(1000, 301)).toEqual(CoverageStatus.MEDIUM);
    expect(getCoverageStatusFromTotals(1000, 500)).toEqual(CoverageStatus.MEDIUM);
    expect(getCoverageStatusFromTotals(1000, 800)).toEqual(CoverageStatus.MEDIUM);
  });

  it('should return high if total expenses are > 80% of the total spend', () => {
    expect(getCoverageStatusFromTotals(1000, 801)).toEqual(CoverageStatus.HIGH);
    expect(getCoverageStatusFromTotals(1000, 900)).toEqual(CoverageStatus.HIGH);
    expect(getCoverageStatusFromTotals(1000, 1000)).toEqual(CoverageStatus.HIGH);
  });
});

describe('getPercentage', () => {
  it('should return the correct percentage', () => {
    expect(getPercentage(10, 20)).toEqual(50);
    expect(getPercentage(3, 4)).toEqual(75);
  });

  it('should take the min value into account', () => {
    expect(getPercentage(10, 20, 10)).toEqual(0);
    expect(getPercentage(3, 4, 2)).toEqual(50);
  });
});
