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

export const COOKIES_LOGGING_CATEGORY = 'CookiesSettings';
export const DASHBOARD_LOGGING_CATEGORY = 'Dashboard';
export const FOOTER_LOGGING_CATEGORY = 'Footer';
export const LANDING_PAGE_LOGGING_CATEGORY = 'LandingPage';
export const NAVIGATION_LOGGING_CATEGORY = 'Navigation';
export const ONBOARDING_LOGGING_CATEGORY = 'Onboarding';
export const PAGE_TIMING_LOGGING_CATEGORY = 'PageTiming';
export const ORGANIZATION_SETTINGS_LOGGING_CATEGORY = 'OrganizationSettings';
export const WIZARD_INTERACTION_LOGGING_CATEGORY = 'WizardInteraction';

export type LoggingProperties = {
  category: string;
  value?: number;
  label?: string;
};
