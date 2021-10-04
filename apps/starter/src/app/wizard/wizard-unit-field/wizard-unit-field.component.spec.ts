import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MockIconsModule } from '../../core/icons/icons.mocks';
import { WizardLabelComponent } from '../wizard-label/wizard-label.component';
import { WizardSingleFieldComponent } from '../wizard-single-field/wizard-single-field.component';
import { UnitField } from '../wizard.types';

import { WizardUnitFieldComponent } from './wizard-unit-field.component';
import { WizardUnitFieldModule } from './wizard-unit-field.module';

const UNIT_FIELD: UnitField = { type: 'unit', path: 'test', placeholder: 'Unit placeholder', units: 'area' };

describe('WizardUnitFieldComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatFormFieldModule, MatSelectModule, MockIconsModule, NoopAnimationsModule, WizardUnitFieldModule],
    }).compileComponents();
  });

  const createFixture = (field: UnitField, form: FormGroup): ComponentFixture<WizardUnitFieldComponent> => {
    const fixture = TestBed.createComponent(WizardUnitFieldComponent);
    const component = fixture.componentInstance;

    component.field = field;
    component.form = form;
    fixture.detectChanges();

    return fixture;
  };

  const createForm = (): FormGroup => {
    return new FormGroup({ test: new FormGroup({ value: new FormControl(), unit: new FormControl() }) });
  };

  it('should create', () => {
    const fixture = createFixture(UNIT_FIELD, createForm());
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render a label', () => {
    const fixture = createFixture(UNIT_FIELD, createForm());
    let label = fixture.debugElement.query(By.directive(WizardLabelComponent));
    expect(label).toBeNull();

    const field = { ...UNIT_FIELD, label: 'Unit field label', tip: 'Unit field tip' };
    fixture.componentInstance.field = field;
    fixture.detectChanges();

    label = fixture.debugElement.query(By.directive(WizardLabelComponent));
    expect(label.componentInstance.field).toEqual(
      expect.objectContaining({
        label: 'Unit field label',
        tip: 'Unit field tip',
      })
    );
  });

  it('should create a connected single-field for the value', () => {
    const form = createForm();
    const fixture = createFixture(UNIT_FIELD, form);

    const single = fixture.debugElement.query(By.directive(WizardSingleFieldComponent));
    expect(single.componentInstance).toHaveProperty('form', form);
    expect(single.componentInstance).toHaveProperty('field', {
      path: 'test.value',
      placeholder: 'Unit placeholder',
      type: 'number',
    });
  });

  it('should create a connected select for the relevant units', () => {
    const form = createForm();
    const fixture = createFixture(UNIT_FIELD, form);

    const select = fixture.debugElement.query(By.directive(MatSelect));
    select.nativeElement.click();
    fixture.detectChanges();

    const options = fixture.debugElement.queryAll(By.directive(MatOption));
    expect(options).toHaveLength(2);
    expect(options[0].nativeElement.textContent).toContain('m²');
    expect(options[1].nativeElement.textContent).toContain('ft²');

    options[1].nativeElement.click();
    fixture.detectChanges();

    expect(form.value).toHaveProperty('test', { value: null, unit: 'ft^2' });
  });
});
