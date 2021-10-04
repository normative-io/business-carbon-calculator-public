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

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  LuxonDateAdapter,
  MAT_LUXON_DATE_ADAPTER_OPTIONS,
  MAT_LUXON_DATE_FORMATS,
} from '@angular/material-luxon-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';

import { DateTime } from 'luxon';

import { LoggingService } from '../../core/logging/logging.service';
import { WIZARD_INTERACTION_LOGGING_CATEGORY } from '../../core/logging/logging.utils';
import { LUXON_DATE_FORMAT } from '../../core/utils/dates.utils';

import { DatepickerField } from '../wizard.types';

const DATE_FORMATS: MatDateFormats = {
  ...MAT_LUXON_DATE_FORMATS,
  display: {
    ...MAT_LUXON_DATE_FORMATS.display,
    dateInput: LUXON_DATE_FORMAT,
  },
  parse: {
    ...MAT_LUXON_DATE_FORMATS.parse,
    dateInput: LUXON_DATE_FORMAT,
  },
};

enum Month {
  JAN = 1,
  FEB = 2,
  MAR = 3,
  APR = 4,
  MAY = 5,
  JUN = 6,
  JUL = 7,
  AUG = 8,
  SEP = 9,
  OCT = 10,
  NOV = 11,
  DEC = 12,
}

@Component({
  selector: 'n-wizard-datepicker-field',
  templateUrl: './wizard-datepicker-field.component.html',
  styleUrls: ['./wizard-datepicker-field.component.scss'],
  providers: [
    {
      provide: MAT_LUXON_DATE_ADAPTER_OPTIONS,
      useValue: { useUtc: true },
    },
    {
      provide: DateAdapter,
      useClass: LuxonDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_LUXON_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS },
  ],
})
export class WizardDatepickerFieldComponent implements OnInit {
  @Input() field!: DatepickerField;
  @Input() form!: FormGroup;
  @Output() saveOnFocusOut = new EventEmitter();

  Month = Month;

  dateFormGroup!: FormGroup;
  startDate?: FormControl;
  endDate?: FormControl;
  maxStartDate = DateTime.now().minus({ year: 1 });

  constructor(public loggingService: LoggingService) {}

  ngOnInit() {
    this.dateFormGroup = this.form.get(this.field.path) as FormGroup;
    this.endDate = this.dateFormGroup.get('endDate') as FormControl;
    this.startDate = this.dateFormGroup.get('startDate') as FormControl;
  }

  /** Sets the range to the last year with the starting month. */
  setYearRange(yearType: 'calendar' | 'financial') {
    // Calculate year based on current date
    const startMonth = yearType === 'calendar' ? Month.JAN : Month.APR;
    const { month: currentMonth, year: currentYear } = DateTime.now();
    const endYear = startMonth <= currentMonth ? currentYear : currentYear - 1;

    // Set values in form
    const startDate = DateTime.utc(endYear - 1, startMonth, 1);
    const endDate = startDate.plus({ day: -1, year: 1 }).toUTC();
    this.dateFormGroup.patchValue({ startDate, endDate });

    // Mark as edited
    this.dateFormGroup.markAsDirty();
    this.dateFormGroup.markAllAsTouched();

    this.loggingService.logEvent('DatePrefillSelection', {
      category: WIZARD_INTERACTION_LOGGING_CATEGORY,
      label: yearType,
    });
  }
}
