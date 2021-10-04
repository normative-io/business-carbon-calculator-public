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

import { getPercentage } from '../../core/utils/coverage.utils';

@Component({
  selector: 'n-wizard-progress',
  templateUrl: './wizard-progress.component.html',
  styleUrls: ['./wizard-progress.component.scss'],
})
export class WizardProgressComponent {
  @Input() current!: number;
  @Input() max!: number;
  @Input() min!: number;

  /**
   * This aria-valuetext property, defaulting to the calculated percentage.
   * To add visible labels and/or content, use content projection.
   */
  @Input() label: string | null = null;
  @Input() offset = 0;

  getPercentage(): string {
    // Offsetting so min === current still shows part of bar
    const percentage = getPercentage(this.current, this.max, this.min + this.offset);
    return `${Math.min(100, Math.max(0, percentage))}%`;
  }
}
