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

import { Icon } from '../core/icons/icons.model';

import { WizardEntry } from './ngxs/wizard.model';

/** A page within the wizard flow. */
export type Page = ExpensesPage | LoadingPage | SplashPage | QuestionPage;

/** The base interface for all supported pages within the wizard page. */
interface BasePage {
  id: string;
  type: string;
  hideIf?: (entry: WizardEntry) => boolean;

  trilogy?: 1 | 2 | 3;
  icon?: Icon;
  title: string;
  description?: string;
  why?: string;
  nextLabel?: string;
}

/** A page asking for expenses within categories. */
export interface ExpensesPage extends BasePage {
  type: 'expenses';
  categories: ExpenseCategory[];
}

/** A page informing the user that something is loading/processing. */
export interface LoadingPage extends BasePage {
  type: 'loading';
  animation: string;
  dimensions: string;
  labels: string[];
}

/** A page informing the user of what's coming up. */
export interface SplashPage extends BasePage {
  type: 'splash';
}

/** A page that asks questions and collects user data. */
export interface QuestionPage extends BasePage {
  type: 'question';
  fields: PageField[];
}

/** A group of expenses. */
export interface ExpenseCategory {
  name: string;
  subcategories: ExpenseField[];
}

/** A field within a QuestionPage. */
export type PageField = SingleField | UnitField | RadioField | CheckboxField | DatepickerField | ExpenseField;

/** A relative unit for a value (eg. currency, area). */
export interface Unit {
  /** The unit as shown to the user in the dropdown. */
  name: string;
  /** The unit as shown to the user when selected. */
  shortName?: string;
  /** The unit as sent to the backend. */
  value: string;
}

export interface Field {
  /** The nested path to the form key (eg. `foo.bar`). */
  path: string;
  /** The type of input to render. */
  type: string;

  label?: string;
  tip?: string;
  placeholder?: string;
}

/** A single category that an expense could be allocated to. */
export interface ExpenseField extends Field {
  type: 'expense';
  normId?: string;
}

export interface SingleField extends Field {
  type: 'currency' | 'number';
  suffix?: string;
}

export type UnitType = 'area' | 'currency' | 'length';

export interface UnitField extends Field {
  type: 'unit';
  units: UnitType;
}

export interface RadioField extends Field {
  type: 'radio';
  options: RadioOption[];
}

export interface RadioOption {
  label: string;
  value: string | number | null;
}

export interface CheckboxField extends Field {
  type: 'checkbox';
  label: string;
}

export interface DatepickerField extends Field {
  type: 'date';
}
