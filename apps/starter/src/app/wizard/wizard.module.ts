import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { NgxsModule } from '@ngxs/store';

import { BoldifyPipe } from './boldify.pipe';
import { WizardState } from './ngxs/wizard.state';
import { WizardCheckboxFieldModule } from './wizard-checkbox-field/wizard-checkbox-field.module';
import { WizardDatepickerFieldModule } from './wizard-datepicker-field/wizard-datepicker-field.module';
import { WizardExpensesModule } from './wizard-expenses/wizard-expenses.module';
import { WizardLabelModule } from './wizard-label/wizard-label.module';
import { WizardLoaderModule } from './wizard-loader/wizard-loader.module';
import { WizardNavigationModule } from './wizard-navigation/wizard-navigation.module';
import { WizardProgressModule } from './wizard-progress/wizard-progress.module';
import { WizardRadioFieldModule } from './wizard-radio-field/wizard-radio-field.module';
import { WizardRoutingModule } from './wizard-routing.module';
import { WizardSingleFieldModule } from './wizard-single-field/wizard-single-field.module';
import { WizardUnitFieldModule } from './wizard-unit-field/wizard-unit-field.module';
import { WizardComponent } from './wizard.component';

@NgModule({
  imports: [
    CommonModule,
    NgxsModule.forFeature([WizardState]),
    WizardCheckboxFieldModule,
    WizardDatepickerFieldModule,
    WizardExpensesModule,
    WizardLoaderModule,
    WizardNavigationModule,
    WizardRadioFieldModule,
    WizardRoutingModule,
    WizardSingleFieldModule,
    WizardUnitFieldModule,
    MatIconModule,
    ReactiveFormsModule,
    WizardLabelModule,
    WizardProgressModule,
  ],
  declarations: [BoldifyPipe, WizardComponent],
})
export class WizardModule {}
