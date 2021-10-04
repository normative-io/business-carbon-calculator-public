import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatOption } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { NgxsModule, Store } from '@ngxs/store';

import { BehaviorSubject } from 'rxjs';

import { FetchCountries, FetchSectors } from '../../core/data/data.actions';
import { Country, Sector } from '../../core/data/data.model';
import { DataState } from '../../core/data/data.state';
import { MockIconsModule } from '../../core/icons/icons.mocks';
import { MockLoggingService } from '../../core/logging/logging.mocks';
import { LoggingService } from '../../core/logging/logging.service';
import { ORGANIZATION_SETTINGS_LOGGING_CATEGORY } from '../../core/logging/logging.utils';
import { UpdateOrganization } from '../../core/organization/organization.actions';
import { MOCK_ORGANIZATION_ACCOUNT } from '../../core/organization/organization.mocks';
import { OrganizationState } from '../../core/organization/organization.state';

import { HomeSettingsComponent, REQUEST_DATA_DELETION_EMAIL } from './home-settings.component';
import { HomeSettingsModule } from './home-settings.module';

class MatDialogRefMock {
  close = jest.fn();
}

describe('HomeSettingsComponent', () => {
  let dialog: MatDialogRefMock;
  let dispatch: jest.SpyInstance;
  let logging: MockLoggingService;

  beforeEach(async () => {
    dialog = new MatDialogRefMock();
    logging = new MockLoggingService();

    await TestBed.configureTestingModule({
      declarations: [HomeSettingsComponent],
      imports: [
        HomeSettingsModule,
        MockIconsModule,
        NgxsModule.forRoot([], { developmentMode: true }),
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialog },
        { provide: LoggingService, useValue: logging },
      ],
    }).compileComponents();

    const store = TestBed.inject(Store);
    dispatch = jest.spyOn(store, 'dispatch');

    jest.spyOn(store, 'select').mockImplementation((selector: unknown) => {
      switch (selector) {
        case OrganizationState.organization:
          return new BehaviorSubject(MOCK_ORGANIZATION_ACCOUNT);
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
        default:
          return new BehaviorSubject(null);
      }
    });
  });

  const createComponent = (): ComponentFixture<HomeSettingsComponent> => {
    const fixture = TestBed.createComponent(HomeSettingsComponent);
    fixture.detectChanges();
    return fixture;
  };

  const selectValue = (fixture: ComponentFixture<HomeSettingsComponent>, selectName: string, optionText: string) => {
    const select = fixture.debugElement.query(By.css(`[formControlName=${selectName}]`));
    select.nativeElement.click();
    fixture.detectChanges();

    const options = fixture.debugElement.queryAll(By.directive(MatOption));
    const option = options.find(({ nativeElement }) => nativeElement.innerHTML.includes(optionText));
    option?.nativeElement.click();
  };

  it('should create', () => {
    const { componentInstance: component } = createComponent();
    expect(component).toBeTruthy();
  });

  it("should prefill the values with the user's current data", () => {
    const fixture = createComponent();

    expect(dispatch).toHaveBeenCalledWith([new FetchCountries(), new FetchSectors()]);
    expect(fixture.componentInstance.form.value).toEqual({
      country: { name: 'Sweden', iso2: 'SE', currency: 'SEK' },
      sector: { name: 'Telecommunications', nace: '61' },
    });
  });

  it('should submit the data and close the dialog on clicking save', () => {
    const fixture = createComponent();

    selectValue(fixture, 'country', 'United States of America');
    selectValue(fixture, 'sector', 'Retail sale in non-specialised stores');
    fixture.debugElement.query(By.css('.save')).nativeElement.click();

    expect(dispatch).toHaveBeenCalledWith(new UpdateOrganization({ country: 'US', currency: 'USD', nace: '46' }));
    expect(logging.logEvent).toHaveBeenCalledWith('SaveOrganizationSettings', {
      category: ORGANIZATION_SETTINGS_LOGGING_CATEGORY,
    });

    expect(dialog.close).toHaveBeenCalled();
  });

  it('should open up a mailto: link to request', () => {
    const fixture = createComponent();
    const link = fixture.debugElement.query(By.css('.data__button')).nativeElement;
    expect(link).toHaveProperty('protocol', 'mailto:');
    expect(link).toHaveProperty('href', expect.stringContaining(REQUEST_DATA_DELETION_EMAIL));

    link.click();
    expect(logging.logEvent).toHaveBeenCalledWith('RequestDataDeletionClick', {
      category: ORGANIZATION_SETTINGS_LOGGING_CATEGORY,
    });
  });

  it('should close the dialog on clicking close', () => {
    const fixture = createComponent();
    fixture.debugElement.query(By.css('.close')).nativeElement.click();
    expect(dialog.close).toHaveBeenCalled();
  });
});
