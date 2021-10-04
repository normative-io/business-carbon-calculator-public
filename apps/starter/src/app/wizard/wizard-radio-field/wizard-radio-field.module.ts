import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { WizardLabelModule } from '../wizard-label/wizard-label.module';

import { WizardRadioFieldComponent } from './wizard-radio-field.component';

@NgModule({
  imports: [CommonModule, MatIconModule, ReactiveFormsModule, WizardLabelModule],
  declarations: [WizardRadioFieldComponent],
  exports: [WizardRadioFieldComponent],
})
export class WizardRadioFieldModule {}
