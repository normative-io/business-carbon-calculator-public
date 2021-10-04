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
