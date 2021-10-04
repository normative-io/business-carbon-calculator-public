import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { WizardLabelModule } from '../wizard-label/wizard-label.module';

import { InputFormatDirective } from './input-format.directive';
import { WizardSingleFieldComponent } from './wizard-single-field.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, WizardLabelModule],
  declarations: [InputFormatDirective, WizardSingleFieldComponent],
  exports: [WizardSingleFieldComponent],
})
export class WizardSingleFieldModule {}
