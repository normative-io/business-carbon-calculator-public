import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { Angulartics2Module } from 'angulartics2';

import { OnboardingRoutingModule } from './onboarding-routing.module';
import { OnboardingTermsComponent } from './onboarding-terms/onboarding-terms.component';
import { OnboardingComponent } from './onboarding.component';

@NgModule({
  declarations: [OnboardingComponent, OnboardingTermsComponent],
  imports: [
    Angulartics2Module,
    CommonModule,
    OnboardingRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
})
export class OnboardingModule {}
