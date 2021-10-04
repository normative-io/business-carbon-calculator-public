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

import { OnboardingPage } from './onboarding.types';

export const LOADING_PAGE_ID = 'spinner';
export const TERMS_PAGE_ID = 'terms';

const LOADING_PAGE: OnboardingPage = {
  /**
   * Placeholder page to trigger organization creation API call (made on second-to-last page).
   * This placeholder will display a loading spinner to delay until the organization creation
   * call finishes before redirecting to /wizard.
   * */
  id: LOADING_PAGE_ID,
};

const TERMS_PAGE: OnboardingPage = {
  id: TERMS_PAGE_ID,
  title: 'Terms & conditions',
  subtitle:
    'The handling of your data is important to us. Read through and accept the terms and conditions to set up your Normative account.',
};

/**
 * Config for user onboarding modal to collect company data.
 */
export const ONBOARDING_PAGES: OnboardingPage[] = [
  {
    id: 'welcome',
    title: 'Welcome to **Normative!**',
    subtitle:
      'We are happy to partner with you on measuring your company’s CO2 emissions. Unlike carbon emissions, the more you put into Normative, the more you get out. To show you the most comprehensive information about your emissions, we need get to know you first.',
    buttonText: 'Get started',
  },
  TERMS_PAGE,
  {
    id: 'company',
    title: 'What is the name of your company?',
    field: {
      path: 'name',
      type: 'text',
      placeholder: 'Ex. Cheesecake corp.',
    },
  },
  {
    id: 'vat',
    title: 'What is the VAT identification number for your company?',
    subtitle:
      'If you don’t know what your VAT identification number is, or you don’t have a VAT identification number, please answer N/A.',
    field: {
      path: 'vat',
      type: 'text',
      placeholder: 'Ex. GB999999973',
    },
  },
  {
    id: 'country',
    title: 'Where is your company located?',
    subtitle:
      'The Business Carbon Calculator makes key assumptions based on your country of operation. If you operate or have substantial business activities based in more than one country, our tool won’t be able to give you an accurate carbon footprint estimate.',
    field: {
      path: 'country',
      type: 'countries',
      placeholder: 'Ex. Switzerland',
    },
  },
  {
    id: 'sector',
    title: 'What sector do you operate in?',
    field: {
      path: 'sector',
      type: 'sectors',
      placeholder: 'Ex. Food and beverage service activities',
    },
    buttonText: 'Estimate emissions',
  },

  // Do not remove
  LOADING_PAGE,
];

/** Config for when users are requested to re-allow terms. */
export const TERMS_ONLY_ONBOARDING_PAGES: OnboardingPage[] = [
  TERMS_PAGE,

  // Do not remove
  LOADING_PAGE,
];
