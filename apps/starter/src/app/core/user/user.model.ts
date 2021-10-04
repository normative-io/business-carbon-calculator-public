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
