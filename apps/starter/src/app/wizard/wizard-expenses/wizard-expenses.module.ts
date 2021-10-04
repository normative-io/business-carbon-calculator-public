// Copyright 2022 Meta Mind AB
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
