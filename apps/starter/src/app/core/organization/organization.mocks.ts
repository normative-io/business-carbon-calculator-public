import { OrganizationAccount, OrganizationAccountType } from './organization.model';

export const MOCK_ORGANIZATION_ACCOUNT: OrganizationAccount = {
  _id: '602135ad6d28997ec9716253',
  accountType: OrganizationAccountType.STARTER,
  country: 'SE',
  currency: 'SEK',
  nace: '61',
  name: 'Mock Organization 1',
  vat: '123',
};
