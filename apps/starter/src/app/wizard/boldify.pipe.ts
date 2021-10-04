import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'boldify' })
export class BoldifyPipe implements PipeTransform {
  /** Replace markdown **bold** syntax with html <strong/> tags. */
  transform(value: string): string {
    return value.replace(/\*\*(.*?)\*\*/gm, '<strong>$1</strong>');
  }
}
