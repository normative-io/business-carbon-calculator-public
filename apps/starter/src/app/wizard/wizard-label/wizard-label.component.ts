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
