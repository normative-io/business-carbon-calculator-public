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

import { OrganizationAccountType } from '../organization/organization.model';

import { OrganizationAccountSnapshot, User } from './user.model';

export const MOCK_ORGANIZATION_ACCOUNT_SNAPSHOT: OrganizationAccountSnapshot = {
  _id: '619cae1cc80a3378a658a0fe',
  accountType: OrganizationAccountType.STARTER,
  name: 'Mock Organization 2',
  role: 'admin',
  vat: '123',
};

export const MOCK_USER: User = {
  _id: '588b8a1e3b7ef87570cc409b',
  name: 'Mock User',
  email: 'mock@example.com',
  role: 'user',
  organizationAccounts: [
    { _id: '602135ad6d28997ec9716253', name: 'Mock Organization 1', role: 'admin', vat: '123' },
    MOCK_ORGANIZATION_ACCOUNT_SNAPSHOT,
  ],
};
