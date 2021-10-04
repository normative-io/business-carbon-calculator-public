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
