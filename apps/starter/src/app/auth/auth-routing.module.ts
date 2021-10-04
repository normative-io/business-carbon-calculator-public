import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthSignupComponent } from './auth-signup.component';
import { AuthComponent } from './auth.component';

const routes: Routes = [
  { path: 'callback', component: AuthComponent },
  { path: 'login', component: AuthComponent },
  { path: 'logout', component: AuthComponent },
  { path: 'signup', component: AuthSignupComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
