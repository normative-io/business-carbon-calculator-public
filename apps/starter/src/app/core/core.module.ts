import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsModule } from '@ngxs/store';

import { AuthConfig, AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';

import { environment } from '../../environments/environment';

import { CookiesModule } from './cookies/cookies.module';
import { DataState } from './data/data.state';
import { IconsService } from './icons/icons.service';
import { ImpactService } from './impact/impact.service';
import { ImpactState } from './impact/impact.state';
import { LoggingService } from './logging/logging.service';
import { OrganizationState } from './organization/organization.state';
import { UserService } from './user/user.service';
import { UserState } from './user/user.state';

const AUTH_OPTIONS: AuthConfig = {
  cacheLocation: 'localstorage',
  clientId: environment.AUTH0_CLIENT_ID,
  domain: environment.AUTH0_DOMAIN,
  errorPath: 'auth/login',
  audience: environment.AUTH0_AUDIENCE,
  httpInterceptor: {
    allowedList: [`${environment.NORMATIVE_AUTH_URL}/*`, `${environment.NORMATIVE_DATA_UPLOAD_URL}/*`],
  },
  redirectUri: environment.AUTH0_REDIRECT_URI,
};

@NgModule({
  declarations: [],
  imports: [
    AuthModule.forRoot(AUTH_OPTIONS),
    CommonModule,
    CookiesModule,
    HttpClientModule,
    MatIconModule,
    NgxsModule.forRoot([DataState, ImpactState, OrganizationState, UserState], {
      developmentMode: !environment.production,
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({ disabled: environment.production }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthHttpInterceptor, multi: true },
    IconsService,
    ImpactService,
    UserService,
    LoggingService,
  ],
  exports: [CookiesModule],
})
export class CoreModule {}
