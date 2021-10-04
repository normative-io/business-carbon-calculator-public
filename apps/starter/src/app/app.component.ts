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

import { IconsService } from './core/icons/icons.service';
import { LoggingService } from './core/logging/logging.service';
import { UserService } from './core/user/user.service';

@Component({
  selector: 'n-business-carbon-calculator',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    // To ensure services are initialized across all routes
    private iconsService: IconsService,
    private userService: UserService,
    private loggingService: LoggingService
  ) {}
}
