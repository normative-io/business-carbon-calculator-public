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
