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
