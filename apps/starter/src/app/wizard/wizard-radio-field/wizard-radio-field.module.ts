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
import { MatIconModule } from '@angular/material/icon';

import { WizardLabelModule } from '../wizard-label/wizard-label.module';

import { WizardRadioFieldComponent } from './wizard-radio-field.component';

@NgModule({
  imports: [CommonModule, MatIconModule, ReactiveFormsModule, WizardLabelModule],
  declarations: [WizardRadioFieldComponent],
  exports: [WizardRadioFieldComponent],
})
export class WizardRadioFieldModule {}
