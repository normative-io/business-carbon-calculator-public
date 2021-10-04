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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';

import { CheckboxField } from '../wizard.types';

import { WizardCheckboxFieldComponent } from './wizard-checkbox-field.component';
import { WizardCheckboxFieldModule } from './wizard-checkbox-field.module';

const CHECKBOX_FIELD: CheckboxField = {
  type: 'checkbox',
  path: 'value',
  label: 'First',
};

describe('WizardCheckboxFieldComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WizardCheckboxFieldModule],
    }).compileComponents();
  });

  const createFixture = (field: CheckboxField, form: FormGroup): ComponentFixture<WizardCheckboxFieldComponent> => {
    const fixture = TestBed.createComponent(WizardCheckboxFieldComponent);
    const component = fixture.componentInstance;

    component.field = field;
    component.form = form;
    fixture.detectChanges();

    return fixture;
  };

  it('should create', () => {
    const form = new FormGroup({ value: new FormControl() });
    const fixture = createFixture(CHECKBOX_FIELD, form);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render checkbox input elements', () => {
    const form = new FormGroup({ value: new FormControl() });
    const fixture = createFixture(CHECKBOX_FIELD, form);

    const compiled = fixture.debugElement.nativeElement;
    const firstInput = compiled.querySelector('input[id="value"]');

    expect(firstInput).toBeTruthy();
  });

  it('should register selected checkbox input element', () => {
    const form = new FormGroup({ value: new FormControl() });
    const fixture = createFixture(CHECKBOX_FIELD, form);

    const compiled = fixture.debugElement.nativeElement;
    const firstInput: HTMLInputElement = compiled.querySelector('input[id="value"]');

    expect(firstInput.checked).toEqual(false);

    firstInput.click();

    expect(firstInput.checked).toEqual(true);
    expect(form.value).toEqual({ value: true });
  });

  it('should register deselected value', () => {
    const form = new FormGroup({ value: new FormControl() });
    const fixture = createFixture(CHECKBOX_FIELD, form);

    const compiled = fixture.debugElement.nativeElement;
    const firstInput: HTMLInputElement = compiled.querySelector('input[id="value"]');

    expect(firstInput.checked).toEqual(false);
    expect(form.value).toEqual({ value: null });

    firstInput.click();
    firstInput.click();

    expect(firstInput.checked).toEqual(false);
    expect(form.value).toEqual({ value: false });
  });
});
