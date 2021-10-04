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

import '@angular/common/locales/global/se';

import { LOCALE_ID, NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, BrowserAnimationsModuleConfig } from '@angular/platform-browser/animations';

import { Angulartics2Module } from 'angulartics2';
import { LottieCacheModule, LottieModule } from 'ngx-lottie';

import { createErrorHandler } from '@sentry/angular';
import player from 'lottie-web/build/player/lottie_light';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';

const BROWSER_ANIMATIONS_CONFIG: BrowserAnimationsModuleConfig = {
  disableAnimations: matchMedia('(prefers-reduced-motion)').matches,
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    Angulartics2Module.forRoot({
      pageTracking: {
        clearIds: true,
      },
    }),
    AppRoutingModule,
    BrowserAnimationsModule.withConfig(BROWSER_ANIMATIONS_CONFIG),
    BrowserModule,
    CoreModule,
    LottieCacheModule.forRoot(),
    LottieModule.forRoot({ player: () => player }),
  ],
  providers: [
    // Default to using se locale due to spacing between numbers
    { provide: LOCALE_ID, useValue: 'se' },
    {
      provide: ErrorHandler,
      useValue: createErrorHandler(),
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
