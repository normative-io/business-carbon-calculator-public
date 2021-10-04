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

export const FETCH_COUNTRIES = '[Data] FetchCountries';
export const FETCH_COUNTRIES_SUCCEEDED = '[Data] FetchCountriesSucceeded';
export const FETCH_COUNTRIES_FAILED = '[Data] FetchCountriesFailed';

export const FETCH_SECTORS = '[Data] FetchSectors';
export const FETCH_SECTORS_SUCCEEDED = '[Data] FetchSectorsSucceeded';
export const FETCH_SECTORS_FAILED = '[Data] FetchSectorsFailed';

export class FetchCountries {
  static readonly type = FETCH_COUNTRIES;
}

export class FetchCountriesSucceeded {
  static readonly type = FETCH_COUNTRIES_SUCCEEDED;
  constructor(public payload: Country[]) {}
}
export class FetchCountriesFailed {
  static readonly type = FETCH_COUNTRIES_FAILED;
  constructor(public payload: Error) {}
}

export class FetchSectors {
  static readonly type = FETCH_SECTORS;
}

export class FetchSectorsSucceeded {
  static readonly type = FETCH_SECTORS_SUCCEEDED;
  constructor(public payload: Sector[]) {}
}
export class FetchSectorsFailed {
  static readonly type = FETCH_SECTORS_FAILED;
  constructor(public payload: Error) {}
}
