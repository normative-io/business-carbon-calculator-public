import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { HomeFooterComponent } from './home-footer.component';

@NgModule({
  declarations: [HomeFooterComponent],
  imports: [CommonModule, MatIconModule, RouterModule],
  exports: [HomeFooterComponent],
})
export class HomeFooterModule {}
