import { MOCK_WIZARD_ENTRY_RESPONSE } from '../../wizard/ngxs/wizard.mocks';

import { Impact } from './impact.model';

export const MOCK_IMPACT: Impact = {
  calculationComplete: true,
  starterEntryId: MOCK_WIZARD_ENTRY_RESPONSE._id,

  emissionCalculation: {
    totalEmissions: { value: 2500000, unit: 'kg', indicator: '' },
    emissionsByScope: [
      {
        scope: 'Scope 1',
        emission: { value: 500000, unit: 'kg', indicator: '' },
        categoryBreakdown: [{ category: 'Category 1', emission: { value: 500000, unit: 'kg' } }],
      },
      {
        scope: 'Scope 2',
        emission: { value: 1000000, unit: 'kg', indicator: '' },
        categoryBreakdown: [
          { category: 'Category 2', emission: { value: 600000, unit: 'kg' } },
          { category: 'Category 3', emission: { value: 400000, unit: 'kg' } },
        ],
      },
      {
        scope: 'Scope 3',
        emission: { value: 1500000, unit: 'kg', indicator: '' },
        categoryBreakdown: [
          { category: 'Category 4', emission: { value: 600000, unit: 'kg' } },
          { category: 'Category 5', emission: { value: 400000, unit: 'kg' } },
          { category: 'Category 6', emission: { value: 500000, unit: 'kg' } },
        ],
      },
    ],
  },
};

export const MOCK_IMPACT_FUEL: Impact = {
  calculationComplete: true,
  starterEntryId: MOCK_WIZARD_ENTRY_RESPONSE._id,

  emissionCalculation: {
    totalEmissions: { value: 2500000, unit: 'kg', indicator: '' },
    emissionsByScope: [
      {
        scope: 'Scope 1',
        emission: { value: 500000, unit: 'kg', indicator: '' },
        categoryBreakdown: [{ category: 'Stationary combustion', emission: { value: 500000, unit: 'kg' } }],
      },
      {
        scope: 'Scope 2',
        emission: { value: 1000000, unit: 'kg', indicator: '' },
        categoryBreakdown: [
          { category: 'Category 2', emission: { value: 600000, unit: 'kg' } },
          { category: 'Category 3', emission: { value: 400000, unit: 'kg' } },
        ],
      },
      {
        scope: 'Scope 3',
        emission: { value: 1500000, unit: 'kg', indicator: '' },
        categoryBreakdown: [
          { category: 'Category 4', emission: { value: 600000, unit: 'kg' } },
          { category: 'Category 5', emission: { value: 400000, unit: 'kg' } },
          { category: 'Category 6', emission: { value: 500000, unit: 'kg' } },
        ],
      },
    ],
  },
};
