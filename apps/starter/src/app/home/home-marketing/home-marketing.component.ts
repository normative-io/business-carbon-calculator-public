import { Component } from '@angular/core';

import { distinctUntilChanged, fromEvent, map, startWith } from 'rxjs';

import { LoggingService } from '../../core/logging/logging.service';
import { LANDING_PAGE_LOGGING_CATEGORY } from '../../core/logging/logging.utils';

@Component({
  selector: 'n-home-marketing',
  templateUrl: './home-marketing.component.html',
  styleUrls: ['./home-marketing.component.scss'],
})
export class HomeMarketingComponent {
  shadow$ = fromEvent(window, 'scroll').pipe(
    startWith(window.scrollY),
    map(() => window.scrollY > 0),
    distinctUntilChanged()
  );

  constructor(private loggingService: LoggingService) {}

  logClick(eventName: string) {
    this.loggingService.logEvent(eventName, { category: LANDING_PAGE_LOGGING_CATEGORY });
  }
}
