import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { WizardCheckboxFieldComponent } from './wizard-checkbox-field.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [WizardCheckboxFieldComponent],
  exports: [WizardCheckboxFieldComponent],
})
export class WizardCheckboxFieldModule {}
