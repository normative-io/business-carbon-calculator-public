import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LottieModule } from 'ngx-lottie';

import { WizardLoaderComponent } from './wizard-loader.component';

@NgModule({
  declarations: [WizardLoaderComponent],
  imports: [CommonModule, LottieModule],
  exports: [WizardLoaderComponent],
})
export class WizardLoaderModule {}
