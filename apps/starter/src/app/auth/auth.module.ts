import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthSignupComponent } from './auth-signup.component';
import { AuthComponent } from './auth.component';

@NgModule({
  declarations: [AuthComponent, AuthSignupComponent],
  imports: [CommonModule, AuthRoutingModule],
})
export class AuthModule {}
