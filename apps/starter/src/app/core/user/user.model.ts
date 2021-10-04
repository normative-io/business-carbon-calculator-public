import { HttpErrorResponse } from '@angular/common/http';

import { OrganizationAccountType } from '../organization/organization.model';

export type UserRole = 'guest' | 'user' | 'company' | 'partner' | 'contributor' | 'admin';

export interface User {
  __v?: number;
  _id?: string;
  name: string;
  email: string;
  role: UserRole;
  auth0Id?: string;
  phone_number?: string;
  passwordNotChanged?: boolean;
  password?: string;
  organizationAccounts: OrganizationAccountSnapshot[];
  terms?: Date;
  bccTerms?: string;
  beta?: boolean;
}

export interface OrganizationAccountSnapshot {
  _id: string;
  accountType?: OrganizationAccountType;
  name: string;
  role: string;
  vat?: string;
}

export interface UserStateModel {
  error: HttpErrorResponse | null;
  user: User | null;
}
