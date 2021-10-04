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
