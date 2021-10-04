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
