import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { WizardProgressComponent } from './wizard-progress.component';

@NgModule({
  declarations: [WizardProgressComponent],
  imports: [CommonModule],
  exports: [WizardProgressComponent],
})
export class WizardProgressModule {}
