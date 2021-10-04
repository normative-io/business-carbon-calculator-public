import { SimpleChange } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Angulartics2Module } from 'angulartics2';

import { AuthService } from '@auth0/auth0-angular';
import { DateTime } from 'luxon';

import { MOCK_ROUTES } from '../../app-routing.mocks';
import { MockIconsModule } from '../../core/icons/icons.mocks';
import { LoggingService } from '../../core/logging/logging.service';
import { DASHBOARD_LOGGING_CATEGORY } from '../../core/logging/logging.utils';
import { MOCK_WIZARD_ENTRY_RESPONSE } from '../../wizard/ngxs/wizard.mocks';
import { WizardEntryResponse } from '../../wizard/ngxs/wizard.model';

import { HomeHeaderComponent } from './home-header.component';
import { HomeHeaderModule } from './home-header.module';

const MOCK_SECOND_WIZARD_ENTRY_RESPONSE: WizardEntryResponse = {
  ...MOCK_WIZARD_ENTRY_RESPONSE,
  _id: '2',
  coveredPeriod: {
    startDate: DateTime.utc(2020, 1, 1).toISODate(),
    endDate: DateTime.utc(2020, 12, 31).toISODate(),
  },
};

describe('HomeHeaderComponent', () => {
  let loggingService: LoggingService;
  let logEvent: jest.SpyInstance;
  let logout: jest.SpyInstance;
  let router: Router;

  beforeEach(async () => {
    logout = jest.fn();

    await TestBed.configureTestingModule({
      declarations: [HomeHeaderComponent],
      imports: [
        HomeHeaderModule,
        MockIconsModule,
        NoopAnimationsModule,
        Angulartics2Module.forRoot(),
        RouterTestingModule.withRoutes(MOCK_ROUTES),
      ],
      providers: [{ provide: AuthService, useValue: { logout } }],
    }).compileComponents();

    router = TestBed.inject(Router);
    loggingService = TestBed.inject(LoggingService);
    logEvent = jest.spyOn(loggingService, 'logEvent');
  });

  const createComponent = (
    entry?: WizardEntryResponse,
    entries = [MOCK_WIZARD_ENTRY_RESPONSE, MOCK_SECOND_WIZARD_ENTRY_RESPONSE]
  ): ComponentFixture<HomeHeaderComponent> => {
    const fixture = TestBed.createComponent(HomeHeaderComponent);
    const component = fixture.componentInstance;

    component.entries = entries;
    component.entry = entry;
    component.organization = 'Mock Organisation';

    component.ngOnChanges({
      entries: new SimpleChange(undefined, entries, true),
      entry: new SimpleChange(undefined, entry, true),
    });

    fixture.detectChanges();
    return fixture;
  };

  it('should create', () => {
    const { componentInstance: component } = createComponent();
    expect(component).toBeTruthy();
  });

  it('should render organisation details', () => {
    const { nativeElement } = createComponent();
    expect(nativeElement.querySelector('.overview__title').innerHTML).toContain('Mock Organisation');
  });

  it('should render the time period when an entry is present', async () => {
    const fixture = createComponent(MOCK_WIZARD_ENTRY_RESPONSE);
    await fixture.whenStable();

    const select: MatSelect = fixture.debugElement.query(By.directive(MatSelect)).componentInstance;
    const selected = select.selected as MatOption;
    expect(selected.value).toEqual(MOCK_WIZARD_ENTRY_RESPONSE._id);
    expect(selected.viewValue).toContain('27 Sep 2021 - 27 Mar 2022');
  });

  it('should emit an entry change event when a different time period is selected', () => {
    const fixture = createComponent(MOCK_WIZARD_ENTRY_RESPONSE);
    const emitted = jest.fn();
    fixture.componentInstance.entryChange.subscribe(emitted);

    const select = fixture.debugElement.query(By.directive(MatSelect));
    select.nativeElement.click();
    fixture.detectChanges();

    const options = fixture.debugElement.queryAll(By.directive(MatOption));
    expect(options[1].nativeElement.innerHTML).toContain('1 Jan 2020 - 31 Dec 2020');

    options[1].nativeElement.click();
    expect(emitted).toBeCalledWith(MOCK_SECOND_WIZARD_ENTRY_RESPONSE);
  });

  it('should emit an settings click event when the settings icon is clicked', () => {
    const fixture = createComponent(MOCK_WIZARD_ENTRY_RESPONSE);
    const emitted = jest.fn();
    fixture.componentInstance.settingsClick.subscribe(emitted);

    const settingsButton = fixture.debugElement.query(By.css('.icon-button--settings'));
    settingsButton.nativeElement.click();
    expect(emitted).toHaveBeenCalledTimes(1);
  });

  it('should log click before navigating to a new wizard entry', () => {
    const fixture = createComponent(MOCK_WIZARD_ENTRY_RESPONSE);
    const add = fixture.nativeElement.querySelector('.add__entry');
    add.click();

    expect(logEvent).toHaveBeenCalledWith('AddWizardEntryClick', { category: DASHBOARD_LOGGING_CATEGORY });
    expect(router.url).toEqual('/wizard');
  });

  it('should log click before navigating to editing a wizard entry', () => {
    const fixture = createComponent(MOCK_WIZARD_ENTRY_RESPONSE);
    const edit = fixture.nativeElement.querySelector('.edit__entry');
    edit.click();

    expect(logEvent).toHaveBeenCalledWith('EditWizardEntryClick', { category: DASHBOARD_LOGGING_CATEGORY });
    expect(router.url).toEqual('/wizard/61e6e611acb241000991951e');
  });

  it('should provide the option for the user to logout', () => {
    const fixture = createComponent();
    const accountButton = fixture.debugElement.query(By.css('.icon-button--account'));
    accountButton.nativeElement.click();
    expect(logout).not.toHaveBeenCalled();

    fixture.detectChanges();

    const logoutButton = fixture.debugElement.query(By.css('button.logout'));
    logoutButton.nativeElement.click();
    expect(logout).toHaveBeenCalledWith({ returnTo: 'http://localhost' });
  });
});
