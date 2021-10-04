import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OnboardingComponent } from './onboarding.component';

export const routes: Routes = [{ path: '', component: OnboardingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnboardingRoutingModule {}
