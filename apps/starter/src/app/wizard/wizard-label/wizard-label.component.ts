import { Component, Input } from '@angular/core';

import { Field } from '../wizard.types';

export type WizardLabelVariant = 'default' | 'small';

@Component({
  selector: 'n-wizard-label',
  templateUrl: './wizard-label.component.html',
  styleUrls: ['./wizard-label.component.scss'],
})
export class WizardLabelComponent {
  @Input() field!: Field;

  @Input() eyebrow?: string | null = null;
  @Input() variant?: WizardLabelVariant = 'default';

  isLegend(field: Field) {
    return field.type === 'radio' || field.type === 'date';
  }
}
