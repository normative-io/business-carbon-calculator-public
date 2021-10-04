import { FormGroup } from '@angular/forms';

import { MOCK_ORGANIZATION_ACCOUNT } from '../core/organization/organization.mocks';
import { OrganizationAccount } from '../core/organization/organization.model';
import { getDateTime } from '../core/utils/dates.utils';

import { MOCK_EXPENSES, MOCK_WIZARD_ENTRY } from './ngxs/wizard.mocks';
import { DeprecatedHasVehicles, ExpenseUsage, HeatingType, WizardEntry, YesNoUnknown } from './ngxs/wizard.model';
import { createWizardEntryForm, Expense, patchWizardEntryForm } from './wizard.form';

const DEFAULT_EXPENSES: Expense[] = [
  { description: 'Expense type 2', normId: '002' },
  { description: 'Expense type 1', normId: '001' },
];
const DEFAULT_ARGS: [OrganizationAccount, Expense[]] = [MOCK_ORGANIZATION_ACCOUNT, DEFAULT_EXPENSES];

describe('createWizardEntryForm', () => {
  it('should return a form group with the wizrd entry structure', () => {
    const entry: WizardEntry = {
      // omitted properties have fuller tests below
      numberOfEmployees: 10,
      revenue: { value: 10, unit: 'USD' },
      spend: { value: 10, unit: 'USD' },
      timePeriod: MOCK_WIZARD_ENTRY.timePeriod,
    };

    const form = createWizardEntryForm(...DEFAULT_ARGS);
    expect(form).toBeInstanceOf(FormGroup);

    form.patchValue(entry);

    const value = form.getRawValue();
    expect(value).toEqual(expect.objectContaining(entry));
  });

  describe('electricity', () => {
    const ENTRY_WITH_ELECTRICITY_USAGE: WizardEntry = {
      ...MOCK_WIZARD_ENTRY,
      electricity: {
        energy: { value: 20, unit: 'kWh' },
        hasEnergy: YesNoUnknown.YES,
        hasRenewable: YesNoUnknown.YES,
        hasSpend: YesNoUnknown.YES,
        spend: { value: 10, unit: 'USD' },
      },
    };

    it('should accept all values', () => {
      const form = createWizardEntryForm(...DEFAULT_ARGS, ENTRY_WITH_ELECTRICITY_USAGE);
      const value = form.getRawValue();

      expect(value).toHaveProperty('electricity', ENTRY_WITH_ELECTRICITY_USAGE.electricity);
    });

    it('should reset the spend value if unknown is set', () => {
      const form = createWizardEntryForm(...DEFAULT_ARGS, ENTRY_WITH_ELECTRICITY_USAGE);
      form.get('electricity.hasEnergy')?.setValue(YesNoUnknown.UNKNOWN);

      const { electricity } = form.getRawValue();
      expect(electricity).toHaveProperty('hasEnergy', YesNoUnknown.UNKNOWN);
      expect(electricity).toHaveProperty('energy', expect.objectContaining({ value: null }));
    });

    it('should reset the spend value if unknown is set', () => {
      const form = createWizardEntryForm(...DEFAULT_ARGS, ENTRY_WITH_ELECTRICITY_USAGE);
      form.get('electricity.hasSpend')?.setValue(YesNoUnknown.UNKNOWN);

      const { electricity } = form.getRawValue();
      expect(electricity).toHaveProperty('hasSpend', YesNoUnknown.UNKNOWN);
      expect(electricity).toHaveProperty('spend', expect.objectContaining({ value: null }));
    });

    it('should reset the energy & spend values if no facilties is set', () => {
      const form = createWizardEntryForm(...DEFAULT_ARGS, ENTRY_WITH_ELECTRICITY_USAGE);
      form.get('facilities.hasFacilities')?.setValue(YesNoUnknown.NO);

      const { electricity, facilities } = form.getRawValue();
      expect(facilities).toHaveProperty('hasFacilities', YesNoUnknown.NO);
      expect(electricity).toHaveProperty('energy', expect.objectContaining({ value: null }));
      expect(electricity).toHaveProperty('spend', expect.objectContaining({ value: null }));
    });

    it('should reset unknown if the spend value is set', () => {
      const form = createWizardEntryForm(...DEFAULT_ARGS, ENTRY_WITH_ELECTRICITY_USAGE);
      form.get('electricity.spend.value')?.setValue(20);

      const { electricity } = form.getRawValue();
      expect(electricity).toHaveProperty('hasSpend', YesNoUnknown.YES);
      expect(electricity).toHaveProperty('spend', expect.objectContaining({ value: 20 }));
    });

    it('should reset the renewable value if no spend is set', () => {
      const form = createWizardEntryForm(...DEFAULT_ARGS, ENTRY_WITH_ELECTRICITY_USAGE);
      form.get('electricity.hasSpend')?.setValue(YesNoUnknown.NO);

      const { electricity } = form.getRawValue();
      expect(electricity).toHaveProperty('hasSpend', YesNoUnknown.NO);
      expect(electricity).toHaveProperty('hasRenewable', null);
    });
  });

  describe('expenses', () => {
    it('should accept all values', () => {
      const form = createWizardEntryForm(...DEFAULT_ARGS, { ...MOCK_WIZARD_ENTRY, expenses: MOCK_EXPENSES });

      const value = form.getRawValue();
      expect(value).toHaveProperty('expenses', MOCK_EXPENSES);
    });

    it('should create a form group for each expense', () => {
      const form = createWizardEntryForm(MOCK_ORGANIZATION_ACCOUNT, [
        { description: 'Expense type 3', normId: '003' },
        { description: 'Expense type 4', normId: '004' },
      ]);
      form.get('expenses.0.spend.value')?.setValue(20);

      const { expenses } = form.getRawValue();
      expect(expenses).toEqual([
        { description: 'Expense type 3', normId: '003', spend: { value: 20, unit: 'SEK' } },
        { description: 'Expense type 4', normId: '004', spend: { value: null, unit: 'SEK' } },
      ]);
    });
  });

  describe('facilities', () => {
    const ENTRY_WITH_FACILITIES: WizardEntry = {
      ...MOCK_WIZARD_ENTRY,
      facilities: {
        hasFacilities: YesNoUnknown.YES,
        size: { value: 10, unit: 'm^2' },
      },
    };

    it('should accept all values', () => {
      const form = createWizardEntryForm(...DEFAULT_ARGS, ENTRY_WITH_FACILITIES);

      const value = form.getRawValue();
      expect(value).toHaveProperty('facilities', ENTRY_WITH_FACILITIES.facilities);
    });

    it('should reset the size value if unknown is set', () => {
      const form = createWizardEntryForm(...DEFAULT_ARGS, ENTRY_WITH_FACILITIES);
      form.get('facilities.hasFacilities')?.setValue(YesNoUnknown.UNKNOWN);

      const { facilities } = form.getRawValue();
      expect(facilities).toHaveProperty('hasFacilities', YesNoUnknown.UNKNOWN);
      expect(facilities).toHaveProperty('size', expect.objectContaining({ value: null }));
    });

    it('should reset unknown if the size value is set', () => {
      const form = createWizardEntryForm(...DEFAULT_ARGS, ENTRY_WITH_FACILITIES);
      form.get('facilities.size.value')?.setValue(20);

      const { facilities } = form.getRawValue();
      expect(facilities).toHaveProperty('hasFacilities', YesNoUnknown.YES);
      expect(facilities).toHaveProperty('size', expect.objectContaining({ value: 20 }));
    });
  });

  describe('fuel', () => {
    const ENTRY_WITH_FUEL_USAGE: WizardEntry = {
      ...MOCK_WIZARD_ENTRY,
      fuel: {
        hasSpend: YesNoUnknown.YES,
        hasVehicles: YesNoUnknown.YES,
        hasVolume: YesNoUnknown.YES,
        spend: { value: 10, unit: 'USD' },
        volume: { value: 20, unit: 'l' },
      },
    };

    it('should accept all values', () => {
      const form = createWizardEntryForm(...DEFAULT_ARGS, ENTRY_WITH_FUEL_USAGE);

      const value = form.getRawValue();
      expect(value).toHaveProperty('fuel', ENTRY_WITH_FUEL_USAGE.fuel);
    });

    it('should reset the spend value if unknown is set', () => {
      const form = createWizardEntryForm(...DEFAULT_ARGS, ENTRY_WITH_FUEL_USAGE);
      form.get('fuel.hasSpend')?.setValue(YesNoUnknown.UNKNOWN);

      const { fuel } = form.getRawValue();
      expect(fuel).toHaveProperty('hasSpend', YesNoUnknown.UNKNOWN);
      expect(fuel).toHaveProperty('spend', expect.objectContaining({ value: null }));
    });

    it('should reset the volume value if unknown is set', () => {
      const form = createWizardEntryForm(...DEFAULT_ARGS, ENTRY_WITH_FUEL_USAGE);
      form.get('fuel.hasVolume')?.setValue(YesNoUnknown.UNKNOWN);

      const { fuel } = form.getRawValue();
      expect(fuel).toHaveProperty('hasVolume', YesNoUnknown.UNKNOWN);
      expect(fuel).toHaveProperty('volume', expect.objectContaining({ value: null }));
    });

    it('should reset the spend & volume values if no vehicles is set', () => {
      const form = createWizardEntryForm(...DEFAULT_ARGS, ENTRY_WITH_FUEL_USAGE);
      form.get('fuel.hasVehicles')?.setValue(YesNoUnknown.NO);

      const { fuel } = form.getRawValue();
      expect(fuel).toHaveProperty('hasVehicles', YesNoUnknown.NO);
      expect(fuel).toHaveProperty('spend', expect.objectContaining({ value: null }));
      expect(fuel).toHaveProperty('volume', expect.objectContaining({ value: null }));
    });

    it('should reset unknown if the spend value is set', () => {
      const entry: WizardEntry = { ...MOCK_WIZARD_ENTRY, fuel: { hasSpend: YesNoUnknown.UNKNOWN } };
      const form = createWizardEntryForm(...DEFAULT_ARGS, entry);
      form.get('fuel.spend.value')?.setValue(20);

      const { fuel } = form.getRawValue();
      expect(fuel).toHaveProperty('hasSpend', YesNoUnknown.YES);
      expect(fuel).toHaveProperty('spend', expect.objectContaining({ value: 20 }));
    });

    it('should reset unknown if the volume value is set', () => {
      const entry: WizardEntry = { ...MOCK_WIZARD_ENTRY, fuel: { hasVolume: YesNoUnknown.UNKNOWN } };
      const form = createWizardEntryForm(...DEFAULT_ARGS, entry);
      form.get('fuel.volume.value')?.setValue(20);

      const { fuel } = form.getRawValue();
      expect(fuel).toHaveProperty('hasVolume', YesNoUnknown.YES);
      expect(fuel).toHaveProperty('volume', expect.objectContaining({ value: 20 }));
    });
  });

  describe('heating', () => {
    const ENTRY_WITH_HEATING_USAGE: WizardEntry = {
      ...MOCK_WIZARD_ENTRY,
      heating: {
        energy: { value: 20, unit: 'kWh' },
        hasEnergy: YesNoUnknown.YES,
        hasSpend: YesNoUnknown.YES,
        includedWithElectricity: YesNoUnknown.NO,
        spend: { value: 10, unit: 'USD' },
        type: HeatingType.ELECTRICITY,
      },
    };

    it('should accept all values', () => {
      const form = createWizardEntryForm(...DEFAULT_ARGS, ENTRY_WITH_HEATING_USAGE);

      const value = form.getRawValue();
      expect(value).toHaveProperty('heating', ENTRY_WITH_HEATING_USAGE.heating);
    });

    it('should reset the energy value if unknown is set', () => {
      const form = createWizardEntryForm(...DEFAULT_ARGS, ENTRY_WITH_HEATING_USAGE);
      form.get('heating.hasEnergy')?.setValue(YesNoUnknown.UNKNOWN);

      const { heating } = form.getRawValue();
      expect(heating).toHaveProperty('hasEnergy', YesNoUnknown.UNKNOWN);
      expect(heating).toHaveProperty('energy', expect.objectContaining({ value: null }));
    });

    it('should reset the spend value if unknown is set', () => {
      const form = createWizardEntryForm(...DEFAULT_ARGS, ENTRY_WITH_HEATING_USAGE);
      form.get('heating.hasSpend')?.setValue(YesNoUnknown.UNKNOWN);

      const { heating } = form.getRawValue();
      expect(heating).toHaveProperty('hasSpend', YesNoUnknown.UNKNOWN);
      expect(heating).toHaveProperty('spend', expect.objectContaining({ value: null }));
    });

    it('should reset the energy & spend values if no heating is set', () => {
      const form = createWizardEntryForm(...DEFAULT_ARGS, ENTRY_WITH_HEATING_USAGE);
      form.get('heating.type')?.setValue(HeatingType.NONE);

      const { heating } = form.getRawValue();
      expect(heating).toHaveProperty('type', HeatingType.NONE);
      expect(heating).toHaveProperty('energy', expect.objectContaining({ value: null }));
      expect(heating).toHaveProperty('spend', expect.objectContaining({ value: null }));
    });

    it('should reset the energy & spend value if no facilties is set', () => {
      const form = createWizardEntryForm(...DEFAULT_ARGS, ENTRY_WITH_HEATING_USAGE);
      form.get('facilities.hasFacilities')?.setValue(YesNoUnknown.NO);

      const { facilities, heating } = form.getRawValue();
      expect(facilities).toHaveProperty('hasFacilities', YesNoUnknown.NO);
      expect(heating).toHaveProperty('energy', expect.objectContaining({ value: null }));
      expect(heating).toHaveProperty('spend', expect.objectContaining({ value: null }));
    });

    it('should reset the energy & spend values if included with electricity is set (to yes)', () => {
      const form = createWizardEntryForm(...DEFAULT_ARGS, ENTRY_WITH_HEATING_USAGE);
      form.get('heating.includedWithElectricity')?.setValue(YesNoUnknown.YES);

      const { heating } = form.getRawValue();
      expect(heating).toHaveProperty('includedWithElectricity', YesNoUnknown.YES);
      expect(heating).toHaveProperty('energy', expect.objectContaining({ value: null }));
      expect(heating).toHaveProperty('spend', expect.objectContaining({ value: null }));
    });

    it('should reset included with electricity if another type is set', () => {
      const form = createWizardEntryForm(...DEFAULT_ARGS, ENTRY_WITH_HEATING_USAGE);
      form.get('heating.type')?.setValue(HeatingType.NATURAL_GAS);

      const { heating } = form.getRawValue();
      expect(heating).toHaveProperty('type', HeatingType.NATURAL_GAS);
      expect(heating).toHaveProperty('includedWithElectricity', null);
    });

    it('should reset unknown if the energy value is set', () => {
      const entry = { ...MOCK_WIZARD_ENTRY, heating: { hasEnergy: YesNoUnknown.UNKNOWN } };
      const form = createWizardEntryForm(...DEFAULT_ARGS, entry);
      form.get('heating.energy.value')?.setValue(20);

      const { heating } = form.getRawValue();
      expect(heating).toHaveProperty('hasEnergy', YesNoUnknown.YES);
      expect(heating).toHaveProperty('energy', expect.objectContaining({ value: 20 }));
    });

    it('should reset unknown if the spend value is set', () => {
      const entry = { ...MOCK_WIZARD_ENTRY, heating: { hasSpend: YesNoUnknown.UNKNOWN } };
      const form = createWizardEntryForm(...DEFAULT_ARGS, entry);
      form.get('heating.spend.value')?.setValue(20);

      const { heating } = form.getRawValue();
      expect(heating).toHaveProperty('hasSpend', YesNoUnknown.YES);
      expect(heating).toHaveProperty('spend', expect.objectContaining({ value: 20 }));
    });
  });

  describe('machinery', () => {
    const ENTRY_WITH_MACHINERY_USAGE: WizardEntry = {
      ...MOCK_WIZARD_ENTRY,
      machinery: {
        hasSpend: YesNoUnknown.YES,
        hasMachinery: YesNoUnknown.YES,
        hasVolume: YesNoUnknown.YES,
        spend: { value: 10, unit: 'USD' },
        volume: { value: 20, unit: 'l' },
      },
    };

    it('should accept all values', () => {
      const form = createWizardEntryForm(...DEFAULT_ARGS, ENTRY_WITH_MACHINERY_USAGE);

      const value = form.getRawValue();
      expect(value).toHaveProperty('machinery', ENTRY_WITH_MACHINERY_USAGE.machinery);
    });

    it('should reset the spend value if unknown is set', () => {
      const form = createWizardEntryForm(...DEFAULT_ARGS, ENTRY_WITH_MACHINERY_USAGE);
      form.get('machinery.hasSpend')?.setValue(YesNoUnknown.UNKNOWN);

      const { machinery } = form.getRawValue();
      expect(machinery).toHaveProperty('hasSpend', YesNoUnknown.UNKNOWN);
      expect(machinery).toHaveProperty('spend', expect.objectContaining({ value: null }));
    });

    it('should reset the volume value if unknown is set', () => {
      const form = createWizardEntryForm(...DEFAULT_ARGS, ENTRY_WITH_MACHINERY_USAGE);
      form.get('machinery.hasVolume')?.setValue(YesNoUnknown.UNKNOWN);

      const { machinery } = form.getRawValue();
      expect(machinery).toHaveProperty('hasVolume', YesNoUnknown.UNKNOWN);
      expect(machinery).toHaveProperty('volume', expect.objectContaining({ value: null }));
    });

    it('should reset the spend & volume values if no machinery is set', () => {
      const form = createWizardEntryForm(...DEFAULT_ARGS, ENTRY_WITH_MACHINERY_USAGE);
      form.get('machinery.hasMachinery')?.setValue(YesNoUnknown.NO);

      const { machinery } = form.getRawValue();
      expect(machinery).toHaveProperty('hasMachinery', YesNoUnknown.NO);
      expect(machinery).toHaveProperty('spend', expect.objectContaining({ value: null }));
      expect(machinery).toHaveProperty('volume', expect.objectContaining({ value: null }));
    });

    it('should reset unknown if the spend value is set', () => {
      const entry: WizardEntry = { ...MOCK_WIZARD_ENTRY, machinery: { hasSpend: YesNoUnknown.UNKNOWN } };
      const form = createWizardEntryForm(...DEFAULT_ARGS, entry);
      form.get('machinery.spend.value')?.setValue(20);

      const { machinery } = form.getRawValue();
      expect(machinery).toHaveProperty('hasSpend', YesNoUnknown.YES);
      expect(machinery).toHaveProperty('spend', expect.objectContaining({ value: 20 }));
    });

    it('should reset unknown if the volume value is set', () => {
      const entry: WizardEntry = { ...MOCK_WIZARD_ENTRY, machinery: { hasVolume: YesNoUnknown.UNKNOWN } };
      const form = createWizardEntryForm(...DEFAULT_ARGS, entry);
      form.get('machinery.volume.value')?.setValue(20);

      const { machinery } = form.getRawValue();
      expect(machinery).toHaveProperty('hasVolume', YesNoUnknown.YES);
      expect(machinery).toHaveProperty('volume', expect.objectContaining({ value: 20 }));
    });
  });

  describe('timePeriod', () => {
    it('should accept all values', () => {
      const form = createWizardEntryForm(...DEFAULT_ARGS, MOCK_WIZARD_ENTRY);

      const value = form.getRawValue();
      expect(value).toHaveProperty('timePeriod', MOCK_WIZARD_ENTRY.timePeriod);
    });

    it('should set the end date to one year after the start', () => {
      const form = createWizardEntryForm(...DEFAULT_ARGS, MOCK_WIZARD_ENTRY);
      form.patchValue({ timePeriod: { startDate: '2022-01-01T00:00:00.000Z' } });

      const { endDate } = form.getRawValue().timePeriod;
      expect(getDateTime(endDate).toISO()).toEqual('2022-12-31T00:00:00.000Z');
    });
  });
});

describe('patchWizardEntryForm', () => {
  it('should patch the values on the form', () => {
    const form = createWizardEntryForm(...DEFAULT_ARGS);
    patchWizardEntryForm(form, { numberOfEmployees: 20 });

    const value = form.getRawValue();
    expect(value).toHaveProperty('numberOfEmployees', 20);
  });

  it('should migrate fuel.hasSpend=NO to fuel.hasVolume=NO', () => {
    const form = createWizardEntryForm(...DEFAULT_ARGS);
    patchWizardEntryForm(form, { fuel: { hasSpend: YesNoUnknown.NO } });

    const value = form.getRawValue();
    expect(value.fuel).toHaveProperty('hasSpend', undefined);
    expect(value.fuel).toHaveProperty('hasVolume', YesNoUnknown.NO);
  });

  it('should migrate fuel.hasVehicles=vehicles_only to fuel.hasVehicles=yes', () => {
    const deprecatedHasVehicles = DeprecatedHasVehicles.YES_VEHICLES_ONLY as unknown as YesNoUnknown;
    const form = createWizardEntryForm(...DEFAULT_ARGS);
    patchWizardEntryForm(form, { fuel: { hasVehicles: deprecatedHasVehicles } });

    const value = form.getRawValue();
    expect(value.fuel).toHaveProperty('hasVehicles', YesNoUnknown.YES);
    expect(value.machinery).toHaveProperty('hasMachinery', YesNoUnknown.NO);
  });

  it('should migrate fuel.hasVehicles=machinery_only to machinery.hasMachinery=yes', () => {
    const deprecatedHasMachinery = DeprecatedHasVehicles.YES_MACHINERY_ONLY as unknown as YesNoUnknown;
    const form = createWizardEntryForm(...DEFAULT_ARGS);
    patchWizardEntryForm(form, {
      fuel: { hasVehicles: deprecatedHasMachinery, hasSpend: YesNoUnknown.YES, spend: { value: 10, unit: 'EUR' } },
    });

    const value = form.getRawValue();
    expect(value.fuel).toHaveProperty('hasVehicles', YesNoUnknown.NO);
    expect(value.machinery).toHaveProperty('hasMachinery', YesNoUnknown.YES);
    expect(value.machinery).toHaveProperty('hasSpend', YesNoUnknown.YES);
    expect(value.machinery).toHaveProperty('spend', { value: 10, unit: 'EUR' });
  });

  it('should patch the expenses onto the relevant rows based on normId', () => {
    const form = createWizardEntryForm(...DEFAULT_ARGS, { ...MOCK_WIZARD_ENTRY, expenses: MOCK_EXPENSES });
    const expense: ExpenseUsage = { normId: '001', description: 'Changed', spend: { value: 20, unit: 'USD' } };
    patchWizardEntryForm(form, { expenses: [expense] });

    const value = form.getRawValue();
    expect(value).toHaveProperty('expenses', [MOCK_EXPENSES[0], expense]);
  });

  it('should pass the options onto the patchValue call', () => {
    const form = createWizardEntryForm(...DEFAULT_ARGS);
    const patchValue = jest.spyOn(form, 'patchValue');
    patchWizardEntryForm(form, { numberOfEmployees: 20 }, { emitEvent: false });

    expect(patchValue).toHaveBeenCalledWith({ numberOfEmployees: 20 }, { emitEvent: false });
  });
});
