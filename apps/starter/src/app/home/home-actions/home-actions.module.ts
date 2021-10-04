import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { HomeActionsComponent } from './home-actions.component';

@NgModule({
  declarations: [HomeActionsComponent],
  imports: [CommonModule, MatIconModule],
  exports: [HomeActionsComponent],
})
export class HomeActionsModule {}
