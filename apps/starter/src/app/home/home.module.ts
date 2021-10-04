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
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { Angulartics2Module } from 'angulartics2';

import { HomeActionsModule } from './home-actions/home-actions.module';
import { HomeDonutModule } from './home-donut/home-donut.module';
import { HomeFooterModule } from './home-footer/home-footer.module';
import { HomeHeaderModule } from './home-header/home-header.module';
import { HomeMarketingModule } from './home-marketing/home-marketing.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeSettingsModule } from './home-settings/home-settings.module';
import { HomeTotalEmissionsModule } from './home-total-emissions/home-total-emissions.module';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    Angulartics2Module,
    CommonModule,
    HomeDonutModule,
    HomeRoutingModule,
    HomeFooterModule,
    HomeHeaderModule,
    HomeMarketingModule,
    HomeSettingsModule,
    HomeActionsModule,
    HomeTotalEmissionsModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    ReactiveFormsModule,
  ],
})
export class HomeModule {}
