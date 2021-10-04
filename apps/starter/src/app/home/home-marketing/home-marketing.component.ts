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
