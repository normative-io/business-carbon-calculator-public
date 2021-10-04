import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { WizardLabelVariant } from '../wizard-label/wizard-label.component';
import { SingleField } from '../wizard.types';

@Component({
  selector: 'n-wizard-single-field',
  templateUrl: './wizard-single-field.component.html',
  styleUrls: ['./wizard-single-field.component.scss'],
})
export class WizardSingleFieldComponent {
  @Input() field!: SingleField;
  @Input() form!: FormGroup;

  @Input() eyebrow?: string | null;
  @Input() variant?: WizardLabelVariant;

  @Output() saveOnFocusOut = new EventEmitter();
}
