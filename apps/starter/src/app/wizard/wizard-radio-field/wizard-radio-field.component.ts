import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { RadioField } from '../wizard.types';

@Component({
  selector: 'n-wizard-radio-field',
  templateUrl: './wizard-radio-field.component.html',
  styleUrls: ['./wizard-radio-field.component.scss'],
})
export class WizardRadioFieldComponent {
  @Input() field!: RadioField;
  @Input() form!: FormGroup;

  @Input() eyebrow?: string | null;
}
