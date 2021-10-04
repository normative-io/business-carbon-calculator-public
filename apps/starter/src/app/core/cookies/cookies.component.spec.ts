import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { MockLoggingService } from '../logging/logging.mocks';
import { LoggingService } from '../logging/logging.service';

import { CookiesSettingsComponent } from './cookies-settings.component';
import { CookiesComponent } from './cookies.component';
import { MockCookiesService } from './cookies.mocks';
import { ALL_COOKIES_ACCEPTED, CookiesService } from './cookies.service';

describe('CookiesComponent', () => {
  let dialog: MatDialog;
  let service: MockCookiesService;
  let loggingService: MockLoggingService;

  beforeEach(async () => {
    jest.useFakeTimers();

    service = new MockCookiesService();
    loggingService = new MockLoggingService();

    await TestBed.configureTestingModule({
      declarations: [CookiesComponent],
      imports: [NoopAnimationsModule, MatDialogModule],
      providers: [
        { provide: CookiesService, useValue: service },
        { provide: LoggingService, useValue: loggingService },
      ],
    }).compileComponents();

    dialog = TestBed.inject(MatDialog);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const createComponent = (): ComponentFixture<CookiesComponent> => {
    const fixture = TestBed.createComponent(CookiesComponent);
    fixture.detectChanges();
    return fixture;
  };

  it('should create', () => {
    const component = createComponent();
    expect(component).toBeTruthy();
  });

  it('should not show the banner if the terms have been accepted', () => {
    service.accepted$.next(ALL_COOKIES_ACCEPTED);

    const { debugElement } = createComponent();
    jest.runAllTimers();

    const banner = debugElement.query(By.css('.container'));
    expect(banner).toBeNull();
  });

  it('should show the banner (with a delay) if the terms have not been accepted', () => {
    const fixture = createComponent();
    let banner = fixture.debugElement.query(By.css('.container'));
    expect(banner).toBeNull();

    jest.runAllTimers();
    fixture.detectChanges();

    banner = fixture.debugElement.query(By.css('.container'));
    expect(banner).toBeTruthy();
  });

  it('should call accept when the accept button is clicked', () => {
    const fixture = createComponent();
    jest.runAllTimers();
    fixture.detectChanges();

    expect(service.accept).not.toHaveBeenCalled();

    const button = fixture.debugElement.query(By.css('.accept'));
    button.nativeElement.click();

    expect(service.accept).toHaveBeenCalled();
  });

  it('should call configure when the settings button is clicked', () => {
    const fixture = createComponent();
    jest.runAllTimers();
    fixture.detectChanges();

    expect(service.configure).not.toHaveBeenCalled();

    const button = fixture.debugElement.query(By.css('.configure'));
    button.nativeElement.click();

    expect(service.configure).toHaveBeenCalled();
  });

  it('should open the settings dialog when configuring$ is true ', () => {
    const open = jest.spyOn(dialog, 'open');
    const fixture = createComponent();

    expect(open).not.toHaveBeenCalled();

    service.configuring$.next(true);
    fixture.detectChanges();

    expect(open).toHaveBeenCalledWith(CookiesSettingsComponent);
  });
});
