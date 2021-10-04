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
