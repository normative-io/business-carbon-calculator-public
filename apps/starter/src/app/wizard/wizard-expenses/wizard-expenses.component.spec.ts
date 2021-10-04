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

import { DebugElement, LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import {
  MatExpansionModule,
  MatExpansionPanelHeader,
  MatExpansionPanelDescription,
  MatExpansionPanelTitle,
} from '@angular/material/expansion';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { MockIconsModule } from '../../core/icons/icons.mocks';
import { MOCK_ORGANIZATION_ACCOUNT } from '../../core/organization/organization.mocks';
import { CoverageStatus } from '../../core/utils/coverage.utils';
import { WizardProgressComponent } from '../wizard-progress/wizard-progress.component';
import { WizardUnitFieldComponent } from '../wizard-unit-field/wizard-unit-field.component';
import { makeControlForField } from '../wizard.component';
import { ExpenseCategory } from '../wizard.types';

import { WizardExpensesComponent } from './wizard-expenses.component';
import { WizardExpensesModule } from './wizard-expenses.module';

jest.mock('../../core/utils/coverage.utils', () => ({
  ...jest.requireActual('../../core/utils/coverage.utils'),
  getCoverageStatusWording: jest.fn((status) => status), // mocking so we can test status, not final wording
}));

jest.mock('../../core/utils/number.utils', () => {
  return { formatCurrency: (value: number, currency: string) => `${currency} ${value}` };
});

const CATEGORIES: ExpenseCategory[] = [
  {
    name: 'Category 1',
    subcategories: [
      { label: 'Subcategory 1', path: 'one', type: 'expense' },
      { label: 'Subcategory 2', path: 'two', type: 'expense' },
    ],
  },
  {
    name: 'Category 2',
    subcategories: [{ label: 'Subcategory 3', path: 'three', type: 'expense' }],
  },
  { name: 'Category 3', subcategories: [] },
];

describe('WizardExpensesComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatExpansionModule, MockIconsModule, NoopAnimationsModule, RouterTestingModule, WizardExpensesModule],
      providers: [{ provide: LOCALE_ID, useValue: 'se' }],
    }).compileComponents();
  });

  const createFixture = (): ComponentFixture<WizardExpensesComponent> => {
    const fixture = TestBed.createComponent(WizardExpensesComponent);
    const component = fixture.componentInstance;

    component.categories = CATEGORIES;
    component.form = new FormGroup({
      spend: new FormGroup({ value: new FormControl(1000), unit: new FormControl('SEK') }),
      one: makeControlForField(CATEGORIES[0].subcategories[0], MOCK_ORGANIZATION_ACCOUNT),
      two: makeControlForField(CATEGORIES[0].subcategories[1], MOCK_ORGANIZATION_ACCOUNT),
      three: makeControlForField(CATEGORIES[1].subcategories[0], MOCK_ORGANIZATION_ACCOUNT),
    });

    fixture.detectChanges();

    return fixture;
  };

  const NBSP_REGEX = new RegExp(String.fromCharCode(160), 'g');
  const getTextContent = (debugElement: DebugElement): string =>
    debugElement.nativeElement.textContent.replace(NBSP_REGEX, ' ');

  it('should create', () => {
    expect(createFixture()).toBeTruthy();
  });

  it('should render each category in a list', () => {
    const { debugElement } = createFixture();
    const categories = debugElement.queryAll(By.directive(MatExpansionPanelTitle));

    expect(categories).toHaveLength(3);
    expect(categories[0].nativeElement.textContent).toContain('Category 1');
    expect(categories[1].nativeElement.textContent).toContain('Category 2');
    expect(categories[2].nativeElement.textContent).toContain('Category 3');
  });

  it('should render each subcategory as a WizardUnitFieldComponent', () => {
    const fixture = createFixture();
    const category = fixture.debugElement.query(By.directive(MatExpansionPanelHeader));

    category.nativeElement.click();
    fixture.detectChanges();

    const subcategories = fixture.debugElement.queryAll(By.directive(WizardUnitFieldComponent));
    expect(subcategories).toHaveLength(2);
    expect(subcategories[0].componentInstance.field).toHaveProperty('label', 'Subcategory 1');
    expect(subcategories[1].componentInstance.field).toHaveProperty('label', 'Subcategory 2');
  });

  it('should render the total for each category', () => {
    const fixture = createFixture();
    const { form } = fixture.componentInstance;

    form.get('one')?.patchValue({ spend: { value: 10, unit: 'SEK' } });
    form.get('two')?.patchValue({ spend: { value: 20, unit: 'SEK' } });
    fixture.detectChanges();

    const description = fixture.debugElement.query(By.directive(MatExpansionPanelDescription));
    expect(getTextContent(description)).toContain('SEK 30');
  });

  it('should render the total for each category (taking currencies into account)', () => {
    const fixture = createFixture();
    const { form } = fixture.componentInstance;

    form.get('one')?.patchValue({ spend: { value: 10, unit: 'SEK' } });
    form.get('two')?.patchValue({ spend: { value: 20, unit: 'USD' } });
    fixture.detectChanges();

    const description = fixture.debugElement.query(By.directive(MatExpansionPanelDescription));
    expect(getTextContent(description)).toContain('SEK 10 + USD 20');
  });

  it('should render the total for all categories', () => {
    const fixture = createFixture();
    const { form } = fixture.componentInstance;

    form.get('one')?.patchValue({ spend: { value: 10, unit: 'SEK' } });
    form.get('two')?.patchValue({ spend: { value: 30, unit: 'USD' } });
    form.get('three')?.patchValue({ spend: { value: 20, unit: 'USD' } });
    fixture.detectChanges();

    const description = fixture.debugElement.query(By.css('.total'));
    expect(getTextContent(description)).toContain('SEK 10 + USD 50');
  });

  it('should render the current expenses coverage', () => {
    const fixture = createFixture();
    const { form } = fixture.componentInstance;

    form.get('one')?.patchValue({ spend: { value: 10, unit: 'SEK' } });
    form.get('two')?.patchValue({ spend: { value: 20, unit: 'SEK' } });
    fixture.detectChanges();

    const progress = fixture.debugElement.query(By.directive(WizardProgressComponent));
    expect(progress.componentInstance).toHaveProperty('max', 1000);
    expect(progress.componentInstance).toHaveProperty('current', 30);

    expect(progress.nativeElement.innerHTML).toContain('SEK 1000');
    expect(progress.nativeElement.innerHTML).toContain(CoverageStatus.LOW);
  });
});
