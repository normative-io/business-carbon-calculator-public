import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Angulartics2GoogleGlobalSiteTag } from 'angulartics2';

import { LoggingProperties } from './logging.utils';

@Injectable({ providedIn: 'root' })
export class LoggingService {
  constructor(private angulartics2GoogleGlobalSiteTag: Angulartics2GoogleGlobalSiteTag, private router: Router) {}

  logEvent(eventName: string, options: LoggingProperties) {
    this.angulartics2GoogleGlobalSiteTag.eventTrack(eventName, { ...options });
  }
}
