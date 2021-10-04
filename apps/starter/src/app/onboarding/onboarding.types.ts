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
