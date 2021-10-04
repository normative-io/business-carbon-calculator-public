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

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@auth0/auth0-angular';

import { NotFoundComponent } from './not-found/not-found.component';
import { NotFoundModule } from './not-found/not-found.module';
import { OnboardingGuard } from './onboarding/onboarding.guard';
import { StyleguideGuard } from './styleguide/styleguide.guard';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'wizard',
    loadChildren: () => import('./wizard/wizard.module').then((m) => m.WizardModule),
    canActivate: [AuthGuard, OnboardingGuard],
  },
  {
    path: 'onboarding',
    loadChildren: () => import('./onboarding/onboarding.module').then((m) => m.OnboardingModule),
    canActivate: [AuthGuard, OnboardingGuard],
  },
  {
    path: 'signup',
    redirectTo: 'auth/signup',
  },
  {
    path: 'styleguide',
    loadChildren: () => import('./styleguide/styleguide.module').then((m) => m.StyleguideModule),
    canActivate: [AuthGuard, StyleguideGuard],
  },
  {
    path: 'licenses',
    loadChildren: () => import('./licenses/licenses.module').then((m) => m.LicensesModule),
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [NotFoundModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
