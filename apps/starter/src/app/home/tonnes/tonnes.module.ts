import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TonnesPipe } from './tonnes.pipe';

@NgModule({
  declarations: [TonnesPipe],
  imports: [CommonModule],
  exports: [TonnesPipe],
})
export class TonnesModule {}
