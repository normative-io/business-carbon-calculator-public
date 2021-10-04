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

import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

import { AuthService } from '@auth0/auth0-angular';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { LoggingService } from '../../core/logging/logging.service';
import { DASHBOARD_LOGGING_CATEGORY } from '../../core/logging/logging.utils';

import { formatTimePeriod, LUXON_DATE_FORMAT_SHORT } from '../../core/utils/dates.utils';
import { isNonNullable } from '../../core/utils/rxjs.utils';
import { WizardEntryResponse } from '../../wizard/ngxs/wizard.model';

@Component({
  selector: 'n-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.scss'],
})
export class HomeHeaderComponent implements OnChanges, OnDestroy, OnInit {
  @Input() entries: WizardEntryResponse[] = [];
  @Input() entry?: WizardEntryResponse;
  @Input() organization?: string | null;
  @Input() sector?: string | null;
  @Input() country?: string | null;

  @Output() entryChange = new EventEmitter<WizardEntryResponse>();
  @Output() settingsClick = new EventEmitter();

  options: { id: string; timePeriod: string }[] = [];
  selected = new FormControl();
  subscription?: Subscription;

  feedbackLink = `mailto:bcc-feedback@normative.io?subject=Feedback`;

  constructor(private authService: AuthService, private loggingService: LoggingService) {}

  ngOnInit() {
    this.subscription = this.selected.valueChanges
      .pipe(filter(isNonNullable))
      .subscribe((id) => this.onSelectedChange(id));
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.entry) this.onEntryChange(changes.entry.currentValue);
    if (changes.entries) this.onEntriesChange(changes.entries.currentValue);
  }

  logClick(eventName: string) {
    this.loggingService.logEvent(eventName, { category: DASHBOARD_LOGGING_CATEGORY });
  }

  logout() {
    this.logClick('LogoutHeaderClick');
    this.authService.logout({ returnTo: location.origin });
  }

  onSettingsClick() {
    this.logClick('SettingsHeaderClick');
    this.settingsClick.emit();
  }

  private onEntriesChange(entries: WizardEntryResponse[]) {
    this.options = entries.map(({ _id: id, coveredPeriod }) => ({
      id,
      timePeriod: formatTimePeriod(coveredPeriod, '-', LUXON_DATE_FORMAT_SHORT),
    }));
  }

  private onEntryChange(entry?: WizardEntryResponse) {
    this.selected.setValue(entry?._id);
  }

  private onSelectedChange(id: string) {
    const entry = this.entries.find(({ _id }) => _id === id);
    if (entry && entry !== this.entry) this.entryChange.emit(entry);
  }
}
