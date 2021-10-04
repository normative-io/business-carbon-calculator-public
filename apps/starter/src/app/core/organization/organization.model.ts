import { HttpErrorResponse } from '@angular/common/http';

export enum OrganizationAccountType {
  STARTER = 'starter',
  PREMIUM = 'premium',
}

export interface OrganizationAccount {
  _id: string;
  accountType?: OrganizationAccountType;
  country?: string;
  currency?: string;
  nace?: string;
  name: string;
  vat: string;
}

export interface CreateOrganizationAccountRequest {
  accountType?: OrganizationAccountType;
  country?: string;
  currency?: string;
  name: string;
  sector?: string;
  vat: string;
}

export interface OrganizationStateModel {
  error: HttpErrorResponse | null;
  organization: OrganizationAccount | null;
}
