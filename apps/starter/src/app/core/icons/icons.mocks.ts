import { NgModule } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { FakeMatIconRegistry, MatIconTestingModule } from '@angular/material/icon/testing';

@NgModule({
  imports: [MatIconModule, MatIconTestingModule],
  providers: [{ provide: MatIconRegistry, useClass: FakeMatIconRegistry }],
  exports: [MatIconModule],
})
export class MockIconsModule {}
