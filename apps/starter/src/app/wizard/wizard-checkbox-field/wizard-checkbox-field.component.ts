import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { CheckboxField } from '../wizard.types';

@Component({
  selector: 'n-wizard-checkbox-field',
  templateUrl: './wizard-checkbox-field.component.html',
  styleUrls: ['./wizard-checkbox-field.component.scss'],
})
export class WizardCheckboxFieldComponent {
  @Input() field!: CheckboxField;
  @Input() form!: FormGroup;

  getId() {
    return this.field.path.replace(/\./g, '-');
  }
}
