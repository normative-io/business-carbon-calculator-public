import { Component, Input } from '@angular/core';

import { Impact } from '../../core/impact/impact.model';
import { LoggingService } from '../../core/logging/logging.service';
import { DASHBOARD_LOGGING_CATEGORY } from '../../core/logging/logging.utils';
import { WizardEntry } from '../../wizard/ngxs/wizard.model';

const NUMBER_OF_EMPLOYEES_THRESHOLD = 50;

@Component({
  selector: 'n-home-total-emissions',
  templateUrl: './home-total-emissions.component.html',
  styleUrls: ['./home-total-emissions.component.scss'],
})
export class HomeTotalEmissionsComponent {
  @Input() entry?: WizardEntry;
  @Input() impact!: Impact;

  constructor(private loggingService: LoggingService) {}

  logClick(eventName: string) {
    this.loggingService.logEvent(eventName, { category: DASHBOARD_LOGGING_CATEGORY });
  }

  showDemoCta(): boolean {
    return Boolean(this.entry?.numberOfEmployees && this.entry.numberOfEmployees > NUMBER_OF_EMPLOYEES_THRESHOLD);
  }
}
