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
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { Angulartics2Module } from 'angulartics2';

import { DateTime } from 'luxon';

import { MockIconsModule } from '../../core/icons/icons.mocks';
import { LoggingService } from '../../core/logging/logging.service';
import { WIZARD_INTERACTION_LOGGING_CATEGORY } from '../../core/logging/logging.utils';
import { TimePeriod } from '../ngxs/wizard.model';
import { DatepickerField } from '../wizard.types';

import { WizardDatepickerFieldComponent } from './wizard-datepicker-field.component';
import { WizardDatepickerFieldModule } from './wizard-datepicker-field.module';

const DATE_FIELD: DatepickerField = {
  type: 'date',
  path: 'test',
};

type DateFormValue = { [K in keyof TimePeriod]: DateTime };

describe('WizardDatepickerFieldComponent', () => {
  let loggingService: LoggingService;
  let logEvent: jest.SpyInstance;

  beforeEach(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(DateTime.utc(2000, 1, 1).toJSDate()); // Jan 01 2000

    await TestBed.configureTestingModule({
      imports: [
        WizardDatepickerFieldModule,
        MockIconsModule,
        NoopAnimationsModule,
        RouterTestingModule,
        Angulartics2Module.forRoot(),
      ],
    }).compileComponents();

    loggingService = TestBed.inject(LoggingService);

    logEvent = jest.spyOn(loggingService, 'logEvent');
  });

  const createFixture = (field: DatepickerField, form: FormGroup): ComponentFixture<WizardDatepickerFieldComponent> => {
    const fixture = TestBed.createComponent(WizardDatepickerFieldComponent);
    const component = fixture.componentInstance;

    component.field = field;
    component.form = form;
    fixture.detectChanges();

    return fixture;
  };

  const createForm = (): FormGroup => {
    return new FormGroup({ test: new FormGroup({ startDate: new FormControl(), endDate: new FormControl() }) });
  };

  it('should create', () => {
    const fixture = createFixture(DATE_FIELD, createForm());
    expect(fixture.componentInstance).toBeTruthy();

    expect(fixture.nativeElement.querySelector('[placeholder=From]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('[placeholder=To]')).toBeTruthy();
  });

  it('should format the date as a readable format', () => {
    const form = createForm();
    form.get('test.startDate')?.setValue(DateTime.utc(2000, 1, 1));

    const { nativeElement } = createFixture(DATE_FIELD, form);
    const startDateInput = nativeElement.querySelector('input[placeholder=From]');
    expect(startDateInput.value).toEqual('1 January 2000');
  });

  it('should set the values to the last year if the year button is clicked', () => {
    const form = createForm();
    const fixture = createFixture(DATE_FIELD, form);
    const button = fixture.nativeElement.querySelector('[data-preset=year]');
    button.click();

    const dates: DateFormValue = form.value.test;
    expect(dates.startDate.toISODate()).toContain('1999-01-01');
    expect(dates.endDate.toISODate()).toContain('1999-12-31');

    expect(logEvent).toHaveBeenCalledWith('DatePrefillSelection', {
      category: WIZARD_INTERACTION_LOGGING_CATEGORY,
      label: 'calendar',
    });
  });

  it('should set the values to the last financial year if the fiscal year button is clicked', () => {
    const form = createForm();
    const fixture = createFixture(DATE_FIELD, form);
    const button = fixture.nativeElement.querySelector('[data-preset=fiscal]');
    button.click();

    const dates: DateFormValue = form.value.test;
    expect(dates.startDate.toISODate()).toContain('1998-04-01');
    expect(dates.endDate.toISODate()).toContain('1999-03-31');

    expect(logEvent).toHaveBeenCalledWith('DatePrefillSelection', {
      category: WIZARD_INTERACTION_LOGGING_CATEGORY,
      label: 'financial',
    });
  });

  it('should emit onfocus event when input loses focus', () => {
    const fixture = createFixture(DATE_FIELD, createForm());
    jest.spyOn(fixture.componentInstance.saveOnFocusOut, 'emit');

    const input = fixture.nativeElement.querySelector('input');
    input.focus();
    input.dispatchEvent(new Event('input'));
    input.blur();

    fixture.detectChanges();

    expect(fixture.componentInstance.saveOnFocusOut.emit).toHaveBeenCalledTimes(1);
  });
});
