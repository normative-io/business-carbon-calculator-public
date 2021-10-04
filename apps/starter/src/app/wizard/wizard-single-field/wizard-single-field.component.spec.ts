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

import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { WizardLabelComponent } from '../wizard-label/wizard-label.component';
import { SingleField } from '../wizard.types';

import { InputFormatDirective } from './input-format.directive';
import { WizardSingleFieldComponent } from './wizard-single-field.component';
import { WizardSingleFieldModule } from './wizard-single-field.module';

const NUMBER_FIELD: SingleField = {
  type: 'number',
  path: 'value',
  placeholder: 'Placeholder for number',
};

describe('WizardSingleFieldComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WizardSingleFieldModule, NoopAnimationsModule],
      providers: [
        InputFormatDirective,
        { provide: ElementRef, useValue: new ElementRef(document.createElement('input')) },
      ],
    }).compileComponents();
  });

  const createFixture = (field: SingleField, form: FormGroup): ComponentFixture<WizardSingleFieldComponent> => {
    const fixture = TestBed.createComponent(WizardSingleFieldComponent);
    const component = fixture.componentInstance;

    component.field = field;
    component.form = form;
    fixture.detectChanges();

    return fixture;
  };

  const getInput = (fixture: ComponentFixture<WizardSingleFieldComponent>): HTMLInputElement => {
    return fixture.nativeElement.querySelector('input');
  };

  const triggerChange = (fixture: ComponentFixture<WizardSingleFieldComponent>, value: string) => {
    const input = getInput(fixture);
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };

  it('should create', () => {
    const form = new FormGroup({ value: new FormControl() });
    const fixture = createFixture(NUMBER_FIELD, form);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should create a connected input for a single number field', () => {
    const form = new FormGroup({ value: new FormControl() });
    const fixture = createFixture(NUMBER_FIELD, form);

    const input = getInput(fixture);
    expect(input).toBeTruthy();

    triggerChange(fixture, '3');
    expect(form.value).toHaveProperty('value', 3);
  });

  it('should pass the type to the nInputFormat directive', () => {
    const form = new FormGroup({ value: new FormControl() });
    const fixture = createFixture({ ...NUMBER_FIELD, type: 'currency' }, form);

    const withDirective = fixture.debugElement.query(By.directive(InputFormatDirective));
    const directive = withDirective.injector.get(InputFormatDirective);
    expect(directive.nInputFormat).toEqual('currency');
  });

  it('should render a label if provided', () => {
    const form = new FormGroup({ value: new FormControl() });
    const fixture = createFixture(NUMBER_FIELD, form);

    let label = fixture.debugElement.query(By.directive(WizardLabelComponent));
    expect(label).toBeNull();

    const field = { ...NUMBER_FIELD, label: 'Test label' };
    fixture.componentInstance.field = field;
    fixture.detectChanges();

    label = fixture.debugElement.query(By.directive(WizardLabelComponent));
    expect(label.componentInstance.field).toEqual(field);
  });

  it('should add a suffix if provided', () => {
    const form = new FormGroup({ value: new FormControl() });
    const fixture = createFixture(NUMBER_FIELD, form);

    let suffix: HTMLSpanElement = fixture.nativeElement.querySelector('.mat-form-field-suffix');
    expect(suffix).toBeNull();

    fixture.componentInstance.field = { ...NUMBER_FIELD, suffix: 'Test suffix' };
    fixture.detectChanges();

    suffix = fixture.nativeElement.querySelector('.mat-form-field-suffix');
    expect(suffix.innerHTML).toContain('Test suffix');
  });

  it('should emit onfocus event when input loses focus', () => {
    const form = new FormGroup({ value: new FormControl() });
    const fixture = createFixture(NUMBER_FIELD, form);
    jest.spyOn(fixture.componentInstance.saveOnFocusOut, 'emit');

    const input = getInput(fixture);
    input.focus();
    input.value = '20';
    input.dispatchEvent(new Event('input'));
    input.blur();

    fixture.detectChanges();

    expect(fixture.componentInstance.saveOnFocusOut.emit).toHaveBeenCalledTimes(1);
  });
});
