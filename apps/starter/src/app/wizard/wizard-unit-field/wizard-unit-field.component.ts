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

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { WizardLabelVariant } from '../wizard-label/wizard-label.component';
import { AREA_UNITS, CURRENCY_UNITS, LENGTH_UNITS } from '../wizard.config';
import { SingleField, Unit, UnitField } from '../wizard.types';

@Component({
  selector: 'n-wizard-unit-field',
  templateUrl: './wizard-unit-field.component.html',
  styleUrls: ['./wizard-unit-field.component.scss'],
})
export class WizardUnitFieldComponent {
  @Input() field!: UnitField;
  @Input() form!: FormGroup;

  @Input() eyebrow?: string | null;
  @Input() variant?: WizardLabelVariant;

  @Output() saveOnFocusOut = new EventEmitter();

  getLabelField(field: UnitField): SingleField {
    return {
      ...field,
      type: field.units === 'currency' ? 'currency' : 'number',
      path: `${field.path}.value`,
    };
  }

  getSingleField(field: UnitField): SingleField {
    const { path, placeholder, type } = this.getLabelField(field);
    return { placeholder, type, path };
  }

  getUnitDisplayValue(field: UnitField): string {
    const control = this.getUnitFormControl(field);
    const unit = this.getUnits(field).find(({ value }) => value === control.value);
    return unit ? unit.shortName || unit.name : '';
  }

  getUnitFormControl(field: UnitField): FormControl {
    return this.form.get(`${field.path}.unit`) as FormControl;
  }

  getUnits(field: UnitField): Unit[] {
    switch (field.units) {
      case 'area':
        return AREA_UNITS;
      case 'currency':
        return CURRENCY_UNITS;
      case 'length':
        return LENGTH_UNITS;
    }
  }
}
