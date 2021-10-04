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
