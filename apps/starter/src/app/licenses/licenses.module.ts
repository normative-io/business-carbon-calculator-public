import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LicensesRoutingModule } from './licenses-routing.module';

import { LicensesComponent } from './licenses.component';

@NgModule({
  declarations: [LicensesComponent],
  imports: [CommonModule, LicensesRoutingModule],
})
export class LicensesModule {}
