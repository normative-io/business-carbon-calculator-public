import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { WizardLabelModule } from '../wizard-label/wizard-label.module';
import { WizardSingleFieldModule } from '../wizard-single-field/wizard-single-field.module';

import { WizardUnitFieldComponent } from './wizard-unit-field.component';

@NgModule({
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule,
    ReactiveFormsModule,
    WizardLabelModule,
    WizardSingleFieldModule,
  ],
  declarations: [WizardUnitFieldComponent],
  exports: [WizardUnitFieldComponent],
})
export class WizardUnitFieldModule {}
