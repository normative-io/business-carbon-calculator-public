import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';

import { HomeHeaderComponent } from './home-header.component';

@NgModule({
  declarations: [HomeHeaderComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [HomeHeaderComponent],
})
export class HomeHeaderModule {}
