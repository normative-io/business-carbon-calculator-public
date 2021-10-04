import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WizardProgressComponent } from './wizard-progress.component';

describe('WizardProgressComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WizardProgressComponent],
    }).compileComponents();
  });

  interface CreateComponentProps {
    current?: number;
    label?: string | null;
    min?: number;
    max?: number;
    offset?: number;
  }

  const createComponent = ({
    current = 0,
    label = null,
    min = 0,
    max = 0,
    offset = 0,
  }: CreateComponentProps = {}): ComponentFixture<WizardProgressComponent> => {
    const fixture = TestBed.createComponent(WizardProgressComponent);
    const component = fixture.componentInstance;

    component.current = current;
    component.label = label;
    component.min = min;
    component.max = max;
    component.offset = offset;

    fixture.detectChanges();
    return fixture;
  };

  it('should create', () => {
    const { componentInstance: component } = createComponent();
    expect(component).toBeTruthy();
  });

  it('should forward the inputs onto the aria attributes', () => {
    const { nativeElement } = createComponent({ label: '1 of 3', current: 2, max: 3, min: 1 });
    const progressbar: HTMLDivElement = nativeElement.querySelector('[role=progressbar]');

    expect(progressbar.getAttribute('aria-valuemax')).toEqual('3');
    expect(progressbar.getAttribute('aria-valuemin')).toEqual('1');
    expect(progressbar.getAttribute('aria-valuenow')).toEqual('2');
    expect(progressbar.getAttribute('aria-valuetext')).toEqual('1 of 3');
  });

  it('should default the aria-valuetext attribute to the percentage', () => {
    const { nativeElement } = createComponent({ current: 2, max: 5, min: 1 });
    const progressbar: HTMLDivElement = nativeElement.querySelector('[role=progressbar]');
    expect(progressbar.getAttribute('aria-valuetext')).toEqual('25%');
  });

  it('should render the correct bar width', () => {
    const fixture = createComponent({ current: 2, max: 5, min: 1 });
    const bar: HTMLDivElement = fixture.nativeElement.querySelector('.bar');
    expect(bar.style).toHaveProperty('width', '25%');

    fixture.componentInstance.current = 3;
    fixture.detectChanges();
    expect(bar.style).toHaveProperty('width', '50%');
  });

  it('should render the correct bar width when the offet is set', () => {
    const fixture = createComponent({ current: 1, max: 4, min: 1, offset: -1 });
    const bar: HTMLDivElement = fixture.nativeElement.querySelector('.bar');
    expect(bar.style).toHaveProperty('width', '25%');
  });
});
