// Copyright 2022 Meta Mind AB
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Directive, ElementRef, forwardRef, HostListener, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { DECIMAL_SEPARATOR, formatCurrency, formatNumber, parseNumber } from '../../core/utils/number.utils';

/**
 * Parses and formats number inputs.
 *
 * @see https://github.com/angular/angular/blob/master/packages/forms/src/directives/number_value_accessor.ts
 * @see https://medium.com/angular-in-depth/angular-material-matinput-control-with-thousands-separation-ebcbb7b027f4
 */
@Directive({
  selector: 'input[nInputFormat]',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputFormatDirective), multi: true }],
})
export class InputFormatDirective implements ControlValueAccessor {
  @Input() nInputFormat!: 'currency' | 'number';

  @Input()
  set value(value: string | number | null) {
    this.cache(value);
    this.format();
  }

  get value() {
    return this.cached;
  }

  private cached: number | null = null;
  private onChange?: (value: number | null) => void;

  constructor(private elementRef: ElementRef<HTMLInputElement>) {}

  registerOnChange(onChange: (value: number | null) => void) {
    this.onChange = onChange;
  }

  registerOnTouched() {
    // Not required
  }

  writeValue(value: string | number | null) {
    this.cache(value);
    this.format();
  }

  /** Formats the value to the user-readable value when the element has lost focus. */
  @HostListener('blur')
  onBlur() {
    this.format();
  }

  /** Removes any unnecessary decimal places when the element is focused. */
  @HostListener('focus')
  onFocus() {
    this.format({ minimumFractionDigits: 0 });
  }

  /** Stores and triggers the Forms API change callback with the parsed value and formats the input accordinly. */
  @HostListener('input', ['$event.target.value', '$event.target.selectionStart'])
  onInput(value: string, selectionStart: number) {
    this.cache(value);
    if (this.onChange) this.onChange(this.cached);

    // Allow a trailing decimal point (as more input is expected)
    const suffix = value.charAt(value.length - 1) === DECIMAL_SEPARATOR ? DECIMAL_SEPARATOR : '';
    this.format({ minimumFractionDigits: 0 }, suffix);

    // Ensure cursor is at the same position after formatting has been applied
    const positionFromEnd = value.length - selectionStart;
    this.elementRef.nativeElement.selectionEnd = this.elementRef.nativeElement.value.length - positionFromEnd;
  }

  /** Stores a parsed value for use in future formatting/callbacks. */
  private cache(value: string | number | null) {
    if (typeof value === 'string') {
      value = parseNumber(value);
      if (value && this.nInputFormat === 'number') value = Math.round(value);
    }

    this.cached = value;
  }

  /** Updates the value of the element to a user-readable format. */
  private format(options?: Intl.NumberFormatOptions, suffix = '') {
    const formatted =
      this.nInputFormat === 'currency'
        ? formatCurrency(this.cached, null, options)
        : formatNumber(this.cached, options);

    this.elementRef.nativeElement.value = `${formatted}${suffix}`;
  }
}
