import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WizardComponent } from './wizard.component';

const routes: Routes = [
  {
    path: '',
    component: WizardComponent,
    children: [{ path: ':id', component: WizardComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WizardRoutingModule {}
