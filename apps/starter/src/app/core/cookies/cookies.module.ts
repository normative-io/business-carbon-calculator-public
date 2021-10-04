import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';

import { CookiesSettingsComponent } from './cookies-settings.component';
import { CookiesComponent } from './cookies.component';

@NgModule({
  declarations: [CookiesComponent, CookiesSettingsComponent],
  imports: [CommonModule, MatCheckboxModule, MatDialogModule, ReactiveFormsModule],
  exports: [CookiesComponent],
})
export class CookiesModule {}
