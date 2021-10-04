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
