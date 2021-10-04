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
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '@auth0/auth0-angular';

import { OnboardingGuard } from '../onboarding/onboarding.guard';

import { HomeMarketingComponent } from './home-marketing/home-marketing.component';
import { HomeComponent } from './home.component';
import { HomeGuard } from './home.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeMarketingComponent,
    canActivate: [HomeGuard],
  },
  {
    path: 'dashboard',
    component: HomeComponent,
    canActivate: [AuthGuard, OnboardingGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
