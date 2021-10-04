import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { MockIconsModule } from '../../core/icons/icons.mocks';

import { NavigationWarning, WizardNavigationComponent } from './wizard-navigation.component';
import { WizardNavigationModule } from './wizard-navigation.module';

describe('WizardNavigationComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MockIconsModule, NoopAnimationsModule, RouterTestingModule, WizardNavigationModule],
    }).compileComponents();
  });

  const createComponent = (
    key: 'exitLabel' | 'nextLabel' | 'previousLabel',
    label: string,
    warning?: NavigationWarning
  ): ComponentFixture<WizardNavigationComponent> => {
    const fixture = TestBed.createComponent(WizardNavigationComponent);
    fixture.componentInstance[key] = label;
    fixture.componentInstance.warning = warning;
    fixture.detectChanges();
    return fixture;
  };

  it('should create', () => {
    expect(createComponent('exitLabel', 'Test exit')).toBeTruthy();
  });

  describe('warning', () => {
    it('should show an error message if provided', () => {
      const fixture = createComponent('nextLabel', 'Warning');
      expect(fixture.nativeElement.querySelector('.warning')).toBeNull();

      fixture.componentInstance.warning = { text: 'Not Found' };
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.warning').innerHTML).toContain('Not Found');
    });

    it('should show the demo cta if set within the warning', () => {
      const fixture = createComponent('nextLabel', 'Warning', { text: 'Warning' });
      expect(fixture.nativeElement.querySelector('.warning__demo')).toBeNull();

      fixture.componentInstance.warning = { text: 'Not Found', demo: true };
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.warning__demo').innerHTML).toContain('Book a demo');
    });
  });

  describe('exit', () => {
    it('should render the exit button if exitLabel is provided', () => {
      const fixture = createComponent('exitLabel', 'Test exit');
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('[data-exit]');
      expect(button.innerHTML).toContain('Test exit');
    });

    it('should emit the exit event if exitLabel is clicked', () => {
      const fixture = createComponent('exitLabel', 'Test exit');
      jest.spyOn(fixture.componentInstance.exit, 'emit');

      fixture.nativeElement.querySelector('[data-exit]').click();
      expect(fixture.componentInstance.exit.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('next', () => {
    it('should render the next button if nextLabel is provided', () => {
      const fixture = createComponent('nextLabel', 'Test next');
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('[data-next]');
      expect(button.innerHTML).toContain('Test next');
    });

    it('should emit the next event if nextLabel is clicked', () => {
      const fixture = createComponent('nextLabel', 'Test next');
      jest.spyOn(fixture.componentInstance.next, 'emit');

      fixture.nativeElement.querySelector('[data-next]').click();
      expect(fixture.componentInstance.next.emit).toHaveBeenCalledTimes(1);
    });
  });

  describe('previous', () => {
    it('should render the previous button if previousLabel is provided', () => {
      const fixture = createComponent('previousLabel', 'Test previous');
      const button: HTMLButtonElement = fixture.nativeElement.querySelector('[data-previous]');
      expect(button.innerHTML).toContain('Test previous');
    });

    it('should emit the previous event if previousLabel is clicked', () => {
      const fixture = createComponent('previousLabel', 'Test previous');
      jest.spyOn(fixture.componentInstance.previous, 'emit');

      fixture.nativeElement.querySelector('[data-previous]').click();
      expect(fixture.componentInstance.previous.emit).toHaveBeenCalledTimes(1);
    });
  });
});
