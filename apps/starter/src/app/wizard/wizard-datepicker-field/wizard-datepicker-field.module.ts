import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { WizardLabelModule } from '../wizard-label/wizard-label.module';

import { WizardDatepickerFieldComponent } from './wizard-datepicker-field.component';

@NgModule({
  imports: [
    CommonModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    WizardLabelModule,
  ],
  declarations: [WizardDatepickerFieldComponent],
  exports: [WizardDatepickerFieldComponent],
})
export class WizardDatepickerFieldModule {}
