import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TonnesModule } from '../tonnes/tonnes.module';

import { HomeTotalEmissionsComponent } from './home-total-emissions.component';

@NgModule({
  declarations: [HomeTotalEmissionsComponent],
  imports: [CommonModule, TonnesModule],
  exports: [HomeTotalEmissionsComponent],
})
export class HomeTotalEmissionsModule {}
