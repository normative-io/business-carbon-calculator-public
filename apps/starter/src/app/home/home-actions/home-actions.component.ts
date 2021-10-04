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
