import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { NgxsModule, Store } from '@ngxs/store';
import { Angulartics2Module } from 'angulartics2';

import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject } from 'rxjs';

import { FetchCountries, FetchSectors } from '../core/data/data.actions';
import { Country, Sector } from '../core/data/data.model';
import { DataState } from '../core/data/data.state';
import { MockIconsModule } from '../core/icons/icons.mocks';
import { FetchImpact } from '../core/impact/impact.actions';
import { MOCK_IMPACT } from '../core/impact/impact.mocks';
import { Impact } from '../core/impact/impact.model';
import { ImpactState } from '../core/impact/impact.state';
import { LoggingService } from '../core/logging/logging.service';
import { DASHBOARD_LOGGING_CATEGORY } from '../core/logging/logging.utils';
import { MOCK_ORGANIZATION_ACCOUNT } from '../core/organization/organization.mocks';
import { OrganizationState } from '../core/organization/organization.state';
import { MOCK_USER } from '../core/user/user.mocks';
import { UserState } from '../core/user/user.state';
import { MOCK_WIZARD_ENTRY_RESPONSE } from '../wizard/ngxs/wizard.mocks';
import { WizardEntryResponse } from '../wizard/ngxs/wizard.model';

import { HomeActionsModule } from './home-actions/home-actions.module';
import { HomeDonutComponent } from './home-donut/home-donut.component';
import { HomeDonutModule } from './home-donut/home-donut.module';
import { HomeFooterModule } from './home-footer/home-footer.module';
import { HomeHeaderComponent } from './home-header/home-header.component';
import { HomeHeaderModule } from './home-header/home-header.module';
import { HomeSettingsComponent } from './home-settings/home-settings.component';
import { HomeTotalEmissionsComponent } from './home-total-emissions/home-total-emissions.component';
import { HomeTotalEmissionsModule } from './home-total-emissions/home-total-emissions.module';
import { HomeComponent } from './home.component';

class MockMatDialog {
  open = jest.fn();
}

describe('HomeComponent', () => {
  let store: Store;
  let entry$: BehaviorSubject<WizardEntryResponse | null>;
  let dialog: MockMatDialog;
  let impact$: BehaviorSubject<Impact | null>;
  let loggingService: LoggingService;
  let logEvent: jest.SpyInstance;

  beforeEach(async () => {
    dialog = new MockMatDialog();

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        HomeActionsModule,
        HomeDonutModule,
        HomeFooterModule,
        HomeHeaderModule,
        HomeTotalEmissionsModule,
        Angulartics2Module.forRoot(),
        RouterTestingModule,
        MockIconsModule,
        NgxsModule.forRoot([], { developmentMode: true }),
        NoopAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: {} },
        { provide: MatDialog, useValue: dialog },
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
    entry$ = new BehaviorSubject<WizardEntryResponse | null>(MOCK_WIZARD_ENTRY_RESPONSE);
    impact$ = new BehaviorSubject<Impact | null>(MOCK_IMPACT);

    loggingService = TestBed.inject(LoggingService);
    logEvent = jest.spyOn(loggingService, 'logEvent');

    jest.spyOn(store, 'select').mockImplementation((arg: unknown) => {
      switch (arg) {
        case DataState.countries:
          return new BehaviorSubject<Country[]>([
            { name: 'Denmark', iso2: 'DK', currency: 'DKK' },
            { name: 'Sweden', iso2: 'SE', currency: 'SEK' },
            { name: 'United States of America', iso2: 'US', currency: 'USD' },
          ]);
        case DataState.sectors:
          return new BehaviorSubject<Sector[]>([
            { name: 'Retail sale in non-specialised stores', nace: '46' },
            { name: 'Scientific research and development', nace: '72' },
            { name: 'Telecommunications', nace: '61' },
          ]);
        case ImpactState.impact:
          return impact$;
        case ImpactState.entry:
          return entry$;
        case ImpactState.entries:
          return new BehaviorSubject([MOCK_WIZARD_ENTRY_RESPONSE]);
        case OrganizationState.organization:
          return new BehaviorSubject(MOCK_ORGANIZATION_ACCOUNT);
        case UserState.user:
          return new BehaviorSubject(MOCK_USER);
        default:
          return new BehaviorSubject(null);
      }
    });
  });

  const createComponent = (): ComponentFixture<HomeComponent> => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    return fixture;
  };

  it('should create', () => {
    const { componentInstance } = createComponent();
    expect(componentInstance).toBeTruthy();
  });

  it('should fetch the country and sector list on init', () => {
    const dispatch = jest.spyOn(store, 'dispatch');
    createComponent();

    expect(dispatch).toHaveBeenCalledWith([new FetchCountries(), new FetchSectors()]);
  });

  it('should pass the entry value from the store onto the header', () => {
    const fixture = createComponent();
    const header = fixture.debugElement.query(By.directive(HomeHeaderComponent));

    expect(header.componentInstance.entry).toEqual(MOCK_WIZARD_ENTRY_RESPONSE);

    entry$.next(null);
    fixture.detectChanges();

    expect(header.componentInstance.entry).toBeUndefined();
  });

  it('should pass the organization country/sector onto the header', () => {
    const fixture = createComponent();
    const header = fixture.debugElement.query(By.directive(HomeHeaderComponent));

    expect(header.componentInstance.country).toEqual('Sweden');
    expect(header.componentInstance.sector).toEqual('Telecommunications');
  });

  it("should render the estimate cta and a 'ghost donut' when no impact results are available", () => {
    impact$.next(null);
    const { debugElement } = createComponent();

    const estimate = debugElement.query(By.css('.estimate'));
    expect(estimate).toBeTruthy();

    const donut = debugElement.query(By.directive(HomeDonutComponent));
    expect(donut.componentInstance.showImpact).toEqual(false);

    const emissions = debugElement.query(By.directive(HomeTotalEmissionsComponent));
    expect(emissions).toBeNull();
  });

  it("should render the estimate cta and a 'ghost donut' when no data sources have been created", () => {
    entry$.next({ ...MOCK_WIZARD_ENTRY_RESPONSE, dataSources: [] });
    const { debugElement } = createComponent();

    const estimate = debugElement.query(By.css('.estimate'));
    expect(estimate).toBeTruthy();

    const donut = debugElement.query(By.directive(HomeDonutComponent));
    expect(donut.componentInstance.showImpact).toEqual(false);

    const emissions = debugElement.query(By.directive(HomeTotalEmissionsComponent));
    expect(emissions).toBeNull();
  });

  it('should log click for continue button', () => {
    impact$.next(null);
    const { debugElement } = createComponent();

    const estimate = debugElement.query(By.css('.estimate a'));
    expect(estimate).toBeTruthy();

    estimate.nativeElement.click();

    expect(logEvent).toHaveBeenCalledWith('ContinueEstimateButtonClick', {
      category: DASHBOARD_LOGGING_CATEGORY,
    });
  });

  it('should render the emissions and donut components when impact results are available', () => {
    const { debugElement } = createComponent();

    const estimate = debugElement.query(By.css('.estimate'));
    expect(estimate).toBeNull();

    const donut = debugElement.query(By.directive(HomeDonutComponent));
    expect(donut.componentInstance.impact).toEqual(MOCK_IMPACT);
    expect(donut.componentInstance.showImpact).toEqual(true);

    const emissions = debugElement.query(By.directive(HomeTotalEmissionsComponent));
    expect(emissions.componentInstance.impact).toEqual(MOCK_IMPACT);
  });

  it('should dispatch a FetchImpact action when the entry is changed in the header', () => {
    const dispatch = jest.spyOn(store, 'dispatch');
    const { debugElement } = createComponent();

    const header: HomeHeaderComponent = debugElement.query(By.directive(HomeHeaderComponent)).componentInstance;
    header.entryChange.emit(MOCK_WIZARD_ENTRY_RESPONSE);

    expect(dispatch).toHaveBeenCalledWith(new FetchImpact(MOCK_WIZARD_ENTRY_RESPONSE));
  });

  it('should open the settings component in a dialog when trigegred by the header', () => {
    const { debugElement } = createComponent();
    const header: HomeHeaderComponent = debugElement.query(By.directive(HomeHeaderComponent)).componentInstance;
    expect(dialog.open).not.toHaveBeenCalled();

    header.settingsClick.emit();
    expect(dialog.open).toHaveBeenCalledWith(HomeSettingsComponent);
  });
});
