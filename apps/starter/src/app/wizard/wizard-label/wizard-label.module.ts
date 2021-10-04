import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { WizardLabelComponent } from './wizard-label.component';

@NgModule({
  declarations: [WizardLabelComponent],
  imports: [CommonModule],
  exports: [WizardLabelComponent],
})
export class WizardLabelModule {}
