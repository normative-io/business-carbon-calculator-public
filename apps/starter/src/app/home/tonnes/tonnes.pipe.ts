import { Pipe, PipeTransform } from '@angular/core';

import { TonnesService } from './tonnes.service';

@Pipe({ name: 'tonnes' })
export class TonnesPipe implements PipeTransform {
  constructor(private tonnesService: TonnesService) {}

  transform(value?: number): string {
    return typeof value === 'number' ? this.tonnesService.format(this.tonnesService.toTonnes(value)) : '';
  }
}
