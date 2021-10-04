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

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs';

import { LoggingService } from '../logging/logging.service';
import { COOKIES_LOGGING_CATEGORY } from '../logging/logging.utils';

import { CookiesAccepted, CookiesService } from './cookies.service';

export const DEFAULT_COOKIES_ACCEPTED: CookiesAccepted = {
  necessary: true,
  performance: false,
  functional: false,
  targeting: false,
};

@Component({
  selector: 'n-cookies-settings',
  templateUrl: './cookies-settings.component.html',
  styleUrls: ['./cookies-settings.component.scss'],
})
export class CookiesSettingsComponent implements OnDestroy, OnInit {
  form = new FormGroup({
    necessary: new FormControl(),
    performance: new FormControl(),
    functional: new FormControl(),
    targeting: new FormControl(),
  });

  private subscription?: Subscription;

  constructor(private cookiesService: CookiesService, private loggingService: LoggingService) {}

  ngOnInit() {
    this.form.get('necessary')?.disable();
    this.subscription = this.cookiesService.accepted$.subscribe((settings) => this.onSettingsChange(settings));
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  accept() {
    this.cookiesService.accept(this.form.getRawValue());
  }

  logClick(eventName: string) {
    this.loggingService.logEvent(eventName, { category: COOKIES_LOGGING_CATEGORY });
  }

  private onSettingsChange(settings: CookiesAccepted | null) {
    this.form.patchValue(settings || DEFAULT_COOKIES_ACCEPTED);
  }
}
