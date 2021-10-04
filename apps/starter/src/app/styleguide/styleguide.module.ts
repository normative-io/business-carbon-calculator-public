import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { StyleguideRoutingModule } from './styleguide-routing.module';
import { StyleguideComponent } from './styleguide.component';

@NgModule({
  declarations: [StyleguideComponent],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    StyleguideRoutingModule,
  ],
})
export class StyleguideModule {}
