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
