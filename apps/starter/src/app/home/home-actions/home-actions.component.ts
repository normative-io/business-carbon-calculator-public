import { Component, Input } from '@angular/core';

import { LoggingService } from '../../core/logging/logging.service';
import { DASHBOARD_LOGGING_CATEGORY } from '../../core/logging/logging.utils';
import { OrganizationAccount } from '../../core/organization/organization.model';

@Component({
  selector: 'n-home-actions',
  templateUrl: './home-actions.component.html',
  styleUrls: ['./home-actions.component.scss'],
})
export class HomeActionsComponent {
  @Input() organization?: OrganizationAccount | null;

  constructor(private loggingService: LoggingService) {}

  logClick(eventName: string) {
    this.loggingService.logEvent(eventName, { category: DASHBOARD_LOGGING_CATEGORY });
  }

  getBenchmarkUrl() {
    return `https://benchmark.normative.io?region=${this.organization?.country ?? ''}&bccnace=${
      this.organization?.nace ?? ''
    }`;
  }
}
