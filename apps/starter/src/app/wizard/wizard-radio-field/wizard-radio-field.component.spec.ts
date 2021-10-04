import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { WizardLabelComponent } from '../wizard-label/wizard-label.component';
import { RadioField } from '../wizard.types';

import { WizardRadioFieldComponent } from './wizard-radio-field.component';
import { WizardRadioFieldModule } from './wizard-radio-field.module';

const RADIO_FIELD: RadioField = {
  type: 'radio',
  path: 'value',
  options: [
    {
      value: '1',
      label: 'First',
    },
    {
      value: '2',
      label: 'Second',
    },
    {
      value: '3',
      label: 'Third',
    },
  ],
};

describe('WizardRadioFieldComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WizardRadioFieldModule],
    }).compileComponents();
  });

  const createFixture = (field: RadioField, form: FormGroup): ComponentFixture<WizardRadioFieldComponent> => {
    const fixture = TestBed.createComponent(WizardRadioFieldComponent);
    const component = fixture.componentInstance;

    component.field = field;
    component.form = form;
    fixture.detectChanges();

    return fixture;
  };

  it('should create', () => {
    const form = new FormGroup({ value: new FormControl() });
    const fixture = createFixture(RADIO_FIELD, form);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render a label if provided', () => {
    const form = new FormGroup({ value: new FormControl() });
    const fixture = createFixture(RADIO_FIELD, form);

    let label = fixture.debugElement.query(By.directive(WizardLabelComponent));
    expect(label).toBeNull();

    const field = { ...RADIO_FIELD, label: 'Test label' };
    fixture.componentInstance.field = field;
    fixture.detectChanges();

    label = fixture.debugElement.query(By.directive(WizardLabelComponent));
    expect(label.componentInstance.field).toEqual(field);
  });

  it('should render radio input elements', () => {
    const form = new FormGroup({ value: new FormControl() });
    const fixture = createFixture(RADIO_FIELD, form);

    const compiled = fixture.debugElement.nativeElement;
    const firstInput = compiled.querySelector('input[id="1"]');
    const secondInput = compiled.querySelector('input[id="2"]');
    const thirdInput = compiled.querySelector('input[id="3"]');

    expect(firstInput).toBeTruthy();
    expect(secondInput).toBeTruthy();
    expect(thirdInput).toBeTruthy();
  });

  it('should register selected radio input element', () => {
    const form = new FormGroup({ value: new FormControl() });
    const fixture = createFixture(RADIO_FIELD, form);

    const compiled = fixture.debugElement.nativeElement;
    const firstInput: HTMLInputElement = compiled.querySelector('input[id="1"]');
    const secondInput: HTMLInputElement = compiled.querySelector('input[id="2"]');
    const thirdInput: HTMLInputElement = compiled.querySelector('input[id="3"]');

    expect(firstInput.checked).toEqual(false);
    expect(secondInput.checked).toEqual(false);
    expect(thirdInput.checked).toEqual(false);

    firstInput.click();

    expect(firstInput.checked).toEqual(true);
    expect(secondInput.checked).toEqual(false);
    expect(thirdInput.checked).toEqual(false);
    expect(form.value).toEqual({ value: '1' });
  });
});
