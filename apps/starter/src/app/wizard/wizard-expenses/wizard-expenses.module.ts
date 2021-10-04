import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { WizardProgressModule } from '../wizard-progress/wizard-progress.module';
import { WizardUnitFieldModule } from '../wizard-unit-field/wizard-unit-field.module';

import { WizardExpensesComponent } from './wizard-expenses.component';

@NgModule({
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    MatTooltipModule,
    WizardProgressModule,
    WizardUnitFieldModule,
    ReactiveFormsModule,
  ],
  declarations: [WizardExpensesComponent],
  exports: [WizardExpensesComponent],
})
export class WizardExpensesModule {}
