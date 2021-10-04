import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { WizardNavigationComponent } from './wizard-navigation.component';

@NgModule({
  imports: [CommonModule, MatIconModule],
  declarations: [WizardNavigationComponent],
  exports: [WizardNavigationComponent],
})
export class WizardNavigationModule {}
