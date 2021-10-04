import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { InputFormatDirective } from './input-format.directive';

@Component({
  selector: 'n-input-format',
  template: `<input [formControl]="control" [nInputFormat]="type" />`,
})
class InputFormatComponent {
  control = new FormControl(null);
  type!: 'currency' | 'number';
}

describe('InputFormatDirective', () => {
  const createFixture = (type: 'currency' | 'number' = 'number'): ComponentFixture<InputFormatComponent> => {
    const fixture = TestBed.configureTestingModule({
      declarations: [InputFormatDirective, InputFormatComponent],
      imports: [ReactiveFormsModule],
    }).createComponent(InputFormatComponent);

    if (type) fixture.componentInstance.type = type;
    fixture.detectChanges();

    return fixture;
  };

  const getControl = (fixture: ComponentFixture<InputFormatComponent>): FormControl =>
    fixture.componentInstance.control;

  const getInput = (fixture: ComponentFixture<InputFormatComponent>): HTMLInputElement =>
    fixture.debugElement.query(By.directive(InputFormatDirective)).nativeElement;

  const triggerInput = (fixture: ComponentFixture<InputFormatComponent>, value: string) => {
    const input = getInput(fixture);
    input.focus();
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };

  it('should create an instance', () => {
    const input = getInput(createFixture());
    expect(input).toBeTruthy();
  });

  describe('formatting', () => {
    it('should format the initial value', () => {
      const fixture = createFixture();
      getControl(fixture).setValue(12345);
      expect(getInput(fixture)).toHaveProperty('value', '12,345');
    });

    it('should format the value on input', async () => {
      const fixture = createFixture();
      triggerInput(fixture, '12345');
      expect(getInput(fixture)).toHaveProperty('value', '12,345');
    });

    it('should not remove a trailing decimal when editing', () => {
      const fixture = createFixture();
      triggerInput(fixture, '12345.');
      expect(getInput(fixture)).toHaveProperty('value', '12,345.');
    });

    it('should format a currency fully on blur', () => {
      const fixture = createFixture('currency');
      const input = getInput(fixture);

      triggerInput(fixture, '12345.1');
      expect(input).toHaveProperty('value', '12,345.1');

      input.blur();
      expect(input).toHaveProperty('value', '12,345.10');
    });
  });

  describe('parsing', () => {
    it('should parse the value as a number', () => {
      const fixture = createFixture();
      triggerInput(fixture, '15');
      expect(getControl(fixture).value).toEqual(15);
    });

    it('should round the value if of type number', () => {
      const fixture = createFixture();
      triggerInput(fixture, '123.45');
      expect(getControl(fixture).value).toEqual(123);
    });

    it('it should not round the value if of type currency', () => {
      const fixture = createFixture('currency');
      triggerInput(fixture, '123.45');
      expect(getControl(fixture).value).toEqual(123.45);
    });

    it('it should parse a non-numeric value as null', () => {
      const fixture = createFixture('currency');
      triggerInput(fixture, 'abc');
      expect(getControl(fixture).value).toEqual(null);
    });
  });
});
