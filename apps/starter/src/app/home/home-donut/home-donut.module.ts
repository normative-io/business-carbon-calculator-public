import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { TonnesModule } from '../tonnes/tonnes.module';

import { HomeDonutComponent } from './home-donut.component';

@NgModule({
  declarations: [HomeDonutComponent],
  imports: [CommonModule, MatIconModule, MatTooltipModule, TonnesModule],
  exports: [HomeDonutComponent],
})
export class HomeDonutModule {}
