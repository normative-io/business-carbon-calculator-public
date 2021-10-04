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
