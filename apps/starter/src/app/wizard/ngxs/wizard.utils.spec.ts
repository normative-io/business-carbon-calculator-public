import { MOCK_EXPENSES, MOCK_WIZARD_ENTRY } from './wizard.mocks';
import {
  ElectricityUsage,
  ExpenseUsage,
  Facilities,
  FuelUsage,
  HeatingType,
  HeatingUsage,
  MachineryUsage,
  ValueWithUnit,
  YesNoUnknown,
} from './wizard.model';
import { sanitizeWizardEntry } from './wizard.utils';

describe('sanitizeWizardEntry', () => {
  /** Casts the value to the required type (for dealing with fake non-conformant data). */
  const castTo = <T>(value: unknown): T => value as T;

  it('should set all required fields', () => {
    const result = sanitizeWizardEntry(MOCK_WIZARD_ENTRY);
    expect(result).toEqual(MOCK_WIZARD_ENTRY);
  });

  describe('electricity', () => {
    it('should set valid values', () => {
      const electricity: ElectricityUsage = {
        energy: { value: 10, unit: 'kWh' },
        hasEnergy: YesNoUnknown.YES,
        hasRenewable: YesNoUnknown.UNKNOWN,
        hasSpend: YesNoUnknown.YES,
        spend: { value: 2, unit: 'USD' },
      };

      const result = sanitizeWizardEntry({ ...MOCK_WIZARD_ENTRY, electricity });
      expect(result).toHaveProperty('electricity', electricity);
    });

    it('should unset invalid values', () => {
      const electricity = castTo<ElectricityUsage>({
        hasRenewable: null,
        hasSpend: YesNoUnknown.UNKNOWN,
        spend: { value: null },
      });

      const result = sanitizeWizardEntry({ ...MOCK_WIZARD_ENTRY, electricity });
      expect(result).toHaveProperty('electricity', { hasSpend: YesNoUnknown.UNKNOWN });
    });

    it('should unset the property if no valid values are set', () => {
      const electricity = castTo<ElectricityUsage>({
        hasRenewable: null,
        hasSpend: undefined,
        spend: { value: null },
      });

      const result = sanitizeWizardEntry({ ...MOCK_WIZARD_ENTRY, electricity });
      expect(result).not.toHaveProperty('electricity');
    });
  });

  describe('expenses', () => {
    it('should set valid rows', () => {
      const invalid = castTo<ExpenseUsage>({ spend: { value: null } });
      const expenses = [...MOCK_EXPENSES, invalid];

      const result = sanitizeWizardEntry({ ...MOCK_WIZARD_ENTRY, expenses });
      expect(result).toHaveProperty('expenses', MOCK_EXPENSES);
    });

    it('should unset the property if no valid values are set', () => {
      const expenses = [castTo<ExpenseUsage>({ spend: { value: null } })];

      const result = sanitizeWizardEntry({ ...MOCK_WIZARD_ENTRY, expenses });
      expect(result).not.toHaveProperty('expenses');
    });
  });

  describe('facilities', () => {
    it('should set valid values', () => {
      const facilities: Facilities = {
        hasFacilities: YesNoUnknown.YES,
        size: { value: 10, unit: 'm^2' },
      };

      const result = sanitizeWizardEntry({ ...MOCK_WIZARD_ENTRY, facilities });
      expect(result).toHaveProperty('facilities', facilities);
    });

    it('should unset invalid values', () => {
      const facilities = castTo<Facilities>({
        hasFacilities: YesNoUnknown.NO,
        size: { value: null, unit: 'm^2' },
      });

      const result = sanitizeWizardEntry({ ...MOCK_WIZARD_ENTRY, facilities });
      expect(result).toHaveProperty('facilities', { hasFacilities: YesNoUnknown.NO });
    });

    it('should unset the property if no valid values are set', () => {
      const facilities = castTo<Facilities>({
        hasFacilities: undefined,
        size: { value: null },
      });

      const result = sanitizeWizardEntry({ ...MOCK_WIZARD_ENTRY, facilities });
      expect(result).not.toHaveProperty('facilities');
    });
  });

  describe('fuel', () => {
    it('should set valid values', () => {
      const fuel: FuelUsage = {
        hasSpend: YesNoUnknown.YES,
        hasVehicles: YesNoUnknown.YES,
        hasVolume: YesNoUnknown.YES,
        spend: { value: 10, unit: 'USD' },
        volume: { value: 20, unit: 'l' },
      };

      const result = sanitizeWizardEntry({ ...MOCK_WIZARD_ENTRY, fuel });
      expect(result).toHaveProperty('fuel', fuel);
    });

    it('should unset invalid values', () => {
      const fuel = castTo<FuelUsage>({
        hasSpend: null,
        hasVehicles: YesNoUnknown.NO,
        spend: { value: null, unit: 'USD' },
        volume: { value: undefined, unit: 'l' },
      });

      const result = sanitizeWizardEntry({ ...MOCK_WIZARD_ENTRY, fuel });
      expect(result).toHaveProperty('fuel', { hasVehicles: YesNoUnknown.NO });
    });

    it('should unset the property if no valid values are set', () => {
      const fuel = castTo<FuelUsage>({
        hasSpend: undefined,
        hasVehicles: null,
        spend: { value: null, unit: 'USD' },
      });

      const result = sanitizeWizardEntry({ ...MOCK_WIZARD_ENTRY, fuel });
      expect(result).not.toHaveProperty('fuel');
    });
  });

  describe('heating', () => {
    it('should set valid values', () => {
      const heating: HeatingUsage = {
        energy: { value: 20, unit: 'kWh' },
        hasEnergy: YesNoUnknown.YES,
        hasSpend: YesNoUnknown.YES,
        spend: { value: 10, unit: 'USD' },
        type: HeatingType.DISTRICT,
      };

      const result = sanitizeWizardEntry({ ...MOCK_WIZARD_ENTRY, heating });
      expect(result).toHaveProperty('heating', heating);
    });

    it('should unset invalid values', () => {
      const heating = castTo<HeatingUsage>({
        hasSpend: YesNoUnknown.NO,
        spend: { value: undefined, unit: 'USD' },
        type: null,
      });

      const result = sanitizeWizardEntry({ ...MOCK_WIZARD_ENTRY, heating });
      expect(result).toHaveProperty('heating', { hasSpend: YesNoUnknown.NO });
    });

    it('should unset the property if no valid values are set', () => {
      const heating = castTo<HeatingUsage>({
        hasSpend: null,
        spend: { value: undefined, unit: 'USD' },
        type: undefined,
      });

      const result = sanitizeWizardEntry({ ...MOCK_WIZARD_ENTRY, heating });
      expect(result).not.toHaveProperty('heating');
    });
  });

  describe('machinery', () => {
    it('should set valid values', () => {
      const machinery: MachineryUsage = {
        hasSpend: YesNoUnknown.YES,
        hasMachinery: YesNoUnknown.YES,
        hasVolume: YesNoUnknown.YES,
        spend: { value: 10, unit: 'USD' },
        volume: { value: 20, unit: 'l' },
      };

      const result = sanitizeWizardEntry({ ...MOCK_WIZARD_ENTRY, machinery });
      expect(result).toHaveProperty('machinery', machinery);
    });

    it('should unset invalid values', () => {
      const machinery = castTo<MachineryUsage>({
        hasSpend: null,
        hasMachinery: YesNoUnknown.NO,
        spend: { value: null, unit: 'USD' },
        volume: { value: undefined, unit: 'l' },
      });

      const result = sanitizeWizardEntry({ ...MOCK_WIZARD_ENTRY, machinery });
      expect(result).toHaveProperty('machinery', { hasMachinery: YesNoUnknown.NO });
    });

    it('should unset the property if no valid values are set', () => {
      const machinery = castTo<MachineryUsage>({
        hasSpend: undefined,
        hasMachinery: null,
        spend: { value: null, unit: 'USD' },
      });

      const result = sanitizeWizardEntry({ ...MOCK_WIZARD_ENTRY, machinery });
      expect(result).not.toHaveProperty('machinery');
    });
  });

  describe('revenue', () => {
    it('should set valid values', () => {
      const revenue: ValueWithUnit = { value: 10, unit: 'USD' };

      const result = sanitizeWizardEntry({ ...MOCK_WIZARD_ENTRY, revenue });
      expect(result).toHaveProperty('revenue', revenue);
    });

    it('should unset the property if no valid values are set', () => {
      const revenue = castTo<ValueWithUnit>({ value: null, unit: 'm^2' });
      const result = sanitizeWizardEntry({ ...MOCK_WIZARD_ENTRY, revenue });
      expect(result).not.toHaveProperty('revenue');
    });
  });

  describe('spend', () => {
    it('should set valid values', () => {
      const spend: ValueWithUnit = { value: 10, unit: 'USD' };

      const result = sanitizeWizardEntry({ ...MOCK_WIZARD_ENTRY, spend });
      expect(result).toHaveProperty('spend', spend);
    });

    it('should unset the property if no valid values are set', () => {
      const spend = castTo<ValueWithUnit>({ value: null, unit: 'm^2' });
      const result = sanitizeWizardEntry({ ...MOCK_WIZARD_ENTRY, spend });
      expect(result).not.toHaveProperty('spend');
    });
  });
});
