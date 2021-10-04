/** The interface for all supported onboarding pages for organisation data. */
export interface OnboardingPage {
  id: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  field?: OnboardingField;
}

export interface OnboardingField {
  /** The path to the form key (eg. `sector`). */
  path: 'name' | 'vat' | 'country' | 'sector';
  /** The type of input to render. */
  type: 'countries' | 'sectors' | 'text';
  placeholder?: string;
}

/** Serialized format for dropdown options. */
export interface NameAndValue {
  name: string;
  value: unknown;
}
