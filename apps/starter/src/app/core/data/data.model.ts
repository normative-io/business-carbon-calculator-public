export interface Country {
  name: string;
  iso2: string;
  currency: string;
}

export interface DataStateModel {
  countries: Country[];
  error: Error | null;
  sectors: Sector[];
}

export interface Sector {
  name: string;
  nace: string;
}
