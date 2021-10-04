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
