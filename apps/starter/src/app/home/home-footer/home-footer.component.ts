import { Component } from '@angular/core';

import { DateTime } from 'luxon';

import { CookiesService } from '../../core/cookies/cookies.service';
import { LoggingService } from '../../core/logging/logging.service';
import { FOOTER_LOGGING_CATEGORY } from '../../core/logging/logging.utils';

@Component({
  selector: 'n-home-footer',
  templateUrl: './home-footer.component.html',
  styleUrls: ['./home-footer.component.scss'],
})
export class HomeFooterComponent {
  year = DateTime.now().toFormat('yyyy');

  constructor(public cookiesService: CookiesService, private loggingService: LoggingService) {}

  logClick(eventName: string) {
    this.loggingService.logEvent(eventName, { category: FOOTER_LOGGING_CATEGORY });
  }

  onCookiesClick() {
    this.logClick('CookiesSettingsFooterClick');
    this.cookiesService.configure();
  }
}
