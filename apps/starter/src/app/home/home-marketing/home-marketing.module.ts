import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { LottieModule } from 'ngx-lottie';

import { HomeFooterModule } from '../home-footer/home-footer.module';

import { HomeMarketingComponent } from './home-marketing.component';

@NgModule({
  declarations: [HomeMarketingComponent],
  imports: [CommonModule, HomeFooterModule, LottieModule, MatIconModule, RouterModule],
  exports: [HomeMarketingComponent],
})
export class HomeMarketingModule {}
