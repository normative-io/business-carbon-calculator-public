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
