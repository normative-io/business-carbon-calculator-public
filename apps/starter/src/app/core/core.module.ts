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
