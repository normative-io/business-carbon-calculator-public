import { MOCK_ORGANIZATION_ACCOUNT } from '../../core/organization/organization.mocks';

import { ExpenseUsage, WizardEntry, WizardEntryResponse } from './wizard.model';

export const MOCK_WIZARD_ENTRY: WizardEntry = {
  timePeriod: {
    startDate: '2021-09-27',
    endDate: '2022-03-27',
  },
  numberOfEmployees: 8,
};

export const MOCK_WIZARD_ENTRY_RESPONSE: WizardEntryResponse = {
  _id: '61e6e611acb241000991951e',
  createdAt: '2022-01-01T00:00:00.000Z',
  lastUpdatedAt: '2022-01-01T00:00:00.000Z',
  organizationId: MOCK_ORGANIZATION_ACCOUNT._id,
  coveredPeriod: MOCK_WIZARD_ENTRY.timePeriod,
  dataSources: ['6206667a3ed706000a4ee7dc', '6206667a602a1d0009f1ef9d'],
  rawClientState: MOCK_WIZARD_ENTRY,
};

export const MOCK_EXPENSES: ExpenseUsage[] = [
  { description: 'Expense type 2', normId: '002', spend: { value: 10, unit: 'USD' } },
  { description: 'Expense type 1', normId: '001', spend: { value: 20, unit: 'USD' } },
];

export const MOCK_LOW_COVERAGE_WIZARD_ENTRY: WizardEntry = {
  timePeriod: {
    startDate: '2021-09-27',
    endDate: '2022-03-27',
  },
  numberOfEmployees: 8,
  spend: { value: 30, unit: 'USD' },
};

export const MOCK_LOW_COVERAGE_WIZARD_ENTRY_RESPONSE: WizardEntryResponse = {
  _id: '61e6e611acb241000991951e',
  createdAt: '2022-01-01T00:00:00.000Z',
  lastUpdatedAt: '2022-01-01T00:00:00.000Z',
  organizationId: MOCK_ORGANIZATION_ACCOUNT._id,
  coveredPeriod: MOCK_WIZARD_ENTRY.timePeriod,
  dataSources: ['6206667a3ed706000a4ee7dc', '6206667a602a1d0009f1ef9d'],
  rawClientState: MOCK_LOW_COVERAGE_WIZARD_ENTRY,
};

export const MOCK_MEDIUM_COVERAGE_WIZARD_ENTRY: WizardEntry = {
  timePeriod: {
    startDate: '2021-09-27',
    endDate: '2022-03-27',
  },
  numberOfEmployees: 8,
  spend: { value: 30, unit: 'USD' },
  expenses: [
    { description: 'Expense type 2', normId: '002', spend: { value: 10, unit: 'USD' } },
    { description: 'Expense type 1', normId: '001', spend: { value: 12, unit: 'USD' } },
  ],
};

export const MOCK_MEDIUM_COVERAGE_WIZARD_ENTRY_RESPONSE: WizardEntryResponse = {
  _id: '61e6e611acb241000991951e',
  createdAt: '2022-01-01T00:00:00.000Z',
  lastUpdatedAt: '2022-01-01T00:00:00.000Z',
  organizationId: MOCK_ORGANIZATION_ACCOUNT._id,
  coveredPeriod: MOCK_WIZARD_ENTRY.timePeriod,
  dataSources: ['6206667a3ed706000a4ee7dc', '6206667a602a1d0009f1ef9d'],
  rawClientState: MOCK_MEDIUM_COVERAGE_WIZARD_ENTRY,
};

export const MOCK_HIGH_COVERAGE_WIZARD_ENTRY: WizardEntry = {
  timePeriod: {
    startDate: '2021-09-27',
    endDate: '2022-03-27',
  },
  numberOfEmployees: 8,
  spend: { value: 30, unit: 'USD' },
  expenses: MOCK_EXPENSES,
};

export const MOCK_HIGH_COVERAGE_WIZARD_ENTRY_RESPONSE: WizardEntryResponse = {
  _id: '61e6e611acb241000991951e',
  createdAt: '2022-01-01T00:00:00.000Z',
  lastUpdatedAt: '2022-01-01T00:00:00.000Z',
  organizationId: MOCK_ORGANIZATION_ACCOUNT._id,
  coveredPeriod: MOCK_WIZARD_ENTRY.timePeriod,
  dataSources: ['6206667a3ed706000a4ee7dc', '6206667a602a1d0009f1ef9d'],
  rawClientState: MOCK_HIGH_COVERAGE_WIZARD_ENTRY,
};

export const MOCK_MIXED_CURRENCY_WIZARD_ENTRY: WizardEntry = {
  timePeriod: {
    startDate: '2021-09-27',
    endDate: '2022-03-27',
  },
  numberOfEmployees: 8,
  spend: { value: 30, unit: 'USD' },
  expenses: [
    { description: 'Expense type 2', normId: '002', spend: { value: 10, unit: 'GBP' } },
    { description: 'Expense type 1', normId: '001', spend: { value: 12, unit: 'USD' } },
  ],
};

export const MOCK_MIXED_CURRENCY_WIZARD_ENTRY_RESPONSE: WizardEntryResponse = {
  _id: '61e6e611acb241000991951e',
  createdAt: '2022-01-01T00:00:00.000Z',
  lastUpdatedAt: '2022-01-01T00:00:00.000Z',
  organizationId: MOCK_ORGANIZATION_ACCOUNT._id,
  coveredPeriod: MOCK_WIZARD_ENTRY.timePeriod,
  dataSources: ['6206667a3ed706000a4ee7dc', '6206667a602a1d0009f1ef9d'],
  rawClientState: MOCK_MIXED_CURRENCY_WIZARD_ENTRY,
};
