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
