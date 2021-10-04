import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Field } from '../wizard.types';

import { WizardLabelComponent } from './wizard-label.component';

const MOCK_FIELD: Field = {
  label: 'Test label',
  path: 'test',
  type: 'number',
};

describe('WizardLabelComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WizardLabelComponent],
    }).compileComponents();
  });

  interface CreateComponentProps {
    eyebrow?: string;
    field?: Field;
  }

  const createComponent = ({
    field = MOCK_FIELD,
    eyebrow,
  }: CreateComponentProps = {}): ComponentFixture<WizardLabelComponent> => {
    const fixture = TestBed.createComponent(WizardLabelComponent);
    const component = fixture.componentInstance;

    component.eyebrow = eyebrow;
    component.field = field;

    fixture.detectChanges();
    return fixture;
  };

  it('should create', () => {
    const { componentInstance: component } = createComponent();
    expect(component).toBeTruthy();
  });

  it('should render the field label', () => {
    const { nativeElement } = createComponent();
    const label: HTMLLabelElement = nativeElement.querySelector('.label');
    expect(label.innerHTML).toContain('Test label');
    expect(label.tagName).toContain('LABEL');
  });

  it('should render the field label as a lengend if a radio input', () => {
    const { nativeElement } = createComponent({ field: { ...MOCK_FIELD, type: 'radio' } });
    const label: HTMLLegendElement = nativeElement.querySelector('.label');
    expect(label.innerHTML).toContain('Test label');
    expect(label.tagName).toContain('LEGEND');
  });

  it('should render the eyebrow if provided', () => {
    const { nativeElement } = createComponent({ eyebrow: 'Test eyebrow' });
    const eyebrow: HTMLParagraphElement = nativeElement.querySelector('.eyebrow');
    expect(eyebrow.innerHTML).toContain('Test eyebrow');
  });

  it('should render the field tip', () => {
    const { nativeElement } = createComponent({ field: { ...MOCK_FIELD, tip: 'Test tip' } });
    const tip: HTMLParagraphElement = nativeElement.querySelector('.tip');
    expect(tip.innerHTML).toContain('Test tip');
  });

  it('should render a smaller label if variant is set to small', () => {
    const fixture = createComponent();
    const label: HTMLLabelElement = fixture.nativeElement.querySelector('.label');
    expect(label.classList).not.toContain('label--small');

    fixture.componentInstance.variant = 'small';
    fixture.detectChanges();

    expect(label.classList).toContain('label--small');
  });
});
