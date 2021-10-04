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

import { Country, Sector } from './data.model';

export const MOCK_COUNTRIES: Country[] = [
  { name: 'Sweden', iso2: 'SE', currency: 'SEK' },
  { name: 'United States of America', iso2: 'US', currency: 'USD' },
];

export const MOCK_SECTORS: Sector[] = [
  { name: 'Sector 1', nace: '1' },
  { name: 'Sector 2', nace: '2' },
];
