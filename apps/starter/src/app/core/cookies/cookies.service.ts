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

import { Injectable } from '@angular/core';

import { Angulartics2GoogleGlobalSiteTag } from 'angulartics2';

import { BehaviorSubject } from 'rxjs';
import { startWith, pairwise } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

export interface CookiesAccepted {
  necessary: true;
  performance: boolean;
  functional: boolean;
  targeting: boolean;
}

export const ALL_COOKIES_ACCEPTED: CookiesAccepted = {
  necessary: true,
  performance: true,
  functional: true,
  targeting: true,
};

export const LOCAL_STORAGE_KEY = 'app/cookies';

@Injectable({ providedIn: 'root' })
export class CookiesService {
  accepted$ = new BehaviorSubject(this.hasAccepted());
  configuring$ = new BehaviorSubject(false);

  constructor(private angulartics2: Angulartics2GoogleGlobalSiteTag) {
    this.setup();
  }

  accept(settings: CookiesAccepted = ALL_COOKIES_ACCEPTED) {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    } catch (err) {}

    this.accepted$.next(settings);
    this.configuring$.next(false);
  }

  configure(show = true) {
    this.configuring$.next(show);
  }

  private async setup() {
    this.accepted$.pipe(startWith(null), pairwise()).subscribe(([prevSettings, settings]) =>
      !prevSettings
        ? // On first acceptance, load scripts if enabled
          settings && this.enable(settings)
        : // On change, cleanup and reload
          this.reload(settings)
    );
  }

  private hasAccepted(): CookiesAccepted | null {
    try {
      const value = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!value) return null;

      const parsed: CookiesAccepted | boolean | null = JSON.parse(value);
      return parsed &&
        typeof parsed === 'object' &&
        parsed.necessary &&
        'performance' in parsed &&
        'functional' in parsed &&
        'targeting' in parsed
        ? parsed
        : null;
    } catch (err) {
      return null;
    }
  }

  private enable(settings: CookiesAccepted) {
    const { GA_MEASUREMENT_ID: gaId, HOTJAR_ID: hjid, HOTJAR_SNIPPET_VERSION: hjsv } = environment;

    // Global site tag
    if (settings.performance && gaId) {
      window.gtag('config', gaId);
      loadScript(`https://www.googletagmanager.com/gtag/js?id=${gaId}`);
    }

    // Hotjar
    if (settings.performance && hjid && hjsv) {
      window._hjSettings = { hjid, hjsv };
      loadScript(`https://static.hotjar.com/c/hotjar-${hjid}.js?sv=${hjsv}`);
    }

    // Angulartics2
    if (settings.performance) {
      this.angulartics2.startTracking();
    }
  }

  private reload(settings: CookiesAccepted | null) {
    // Remove performance cookies if no longer accepted
    // TODO(): Determine which cookies/values to remove
    if (!settings?.performance) {
      deleteCookies();
      sessionStorage.clear();
    }

    window.location.reload();
  }
}

function deleteCookies() {
  // https://stackoverflow.com/a/179514
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}

function loadScript(src: string) {
  const script = document.createElement('script');
  script.setAttribute('async', 'true');
  script.setAttribute('src', src);
  document.documentElement.firstChild?.appendChild(script);
}

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    _hjSettings: {
      hjid: number;
      hjsv: number;
    };
  }
}
