import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { NgxsModule, Store } from '@ngxs/store';

import { BehaviorSubject, Observable } from 'rxjs';

import { MOCK_ROUTES } from '../app-routing.mocks';

import { MOCK_COUNTRIES, MOCK_SECTORS } from '../core/data/data.mocks';
import { DataState } from '../core/data/data.state';
import { MockIconsModule } from '../core/icons/icons.mocks';
import { MockLoggingService } from '../core/logging/logging.mocks';
import { LoggingService } from '../core/logging/logging.service';
import { ONBOARDING_LOGGING_CATEGORY, PAGE_TIMING_LOGGING_CATEGORY } from '../core/logging/logging.utils';
import { CreateOrganization } from '../core/organization/organization.actions';
import { MOCK_ORGANIZATION_ACCOUNT } from '../core/organization/organization.mocks';
import { OrganizationAccount } from '../core/organization/organization.model';
import { OrganizationState } from '../core/organization/organization.state';
import { AcceptTerms } from '../core/user/user.actions';
import { MOCK_ORGANIZATION_ACCOUNT_SNAPSHOT } from '../core/user/user.mocks';
import { OrganizationAccountSnapshot } from '../core/user/user.model';
import { UserState } from '../core/user/user.state';

import { OnboardingComponent } from './onboarding.component';
import { OnboardingModule } from './onboarding.module';
import { OnboardingField, OnboardingPage } from './onboarding.types';

const ONBOARDING_FIELD: OnboardingField = { path: 'name', type: 'text', placeholder: 'Text placeholder' };
const ONBOARDING_PAGE_INTRO: OnboardingPage = { id: 'intro', title: 'Modal page', subtitle: 'intro' };
const ONBOARDING_PAGE: OnboardingPage = { id: 'field', title: 'Modal page', field: ONBOARDING_FIELD };
const ONBOARDING_PAGE_TERMS: OnboardingPage = { id: 'terms', title: 'Terms & conditions' };
const ONBOARDING_SPINNER_PAGE: OnboardingPage = { id: 'spinner' };

describe('OnboardingComponent', () => {
  let component: OnboardingComponent;
  let dispatch: jest.SpyInstance;
  let fixture: ComponentFixture<OnboardingComponent>;
  let router: Router;
  let loggingService: MockLoggingService;

  let acceptedTerms$: BehaviorSubject<boolean>;
  let organization$: BehaviorSubject<OrganizationAccount | null>;
  let organizationSnapshot$: BehaviorSubject<OrganizationAccountSnapshot | null>;

  beforeEach(() => {
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    loggingService = new MockLoggingService();

    await TestBed.configureTestingModule({
      declarations: [OnboardingComponent],
      imports: [
        MockIconsModule,
        NgxsModule.forRoot([], { developmentMode: true }),
        NoopAnimationsModule,
        OnboardingModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes(MOCK_ROUTES),
      ],
      providers: [{ provide: LoggingService, useValue: loggingService }],
    }).compileComponents();

    router = TestBed.inject(Router);

    // Mock store
    const store = TestBed.inject(Store);
    dispatch = jest.spyOn(store, 'dispatch').mockImplementation(() => new Observable());

    acceptedTerms$ = new BehaviorSubject<boolean>(false);
    organization$ = new BehaviorSubject<OrganizationAccount | null>(null);
    organizationSnapshot$ = new BehaviorSubject<OrganizationAccountSnapshot | null>(null);

    jest.spyOn(store, 'select').mockImplementation((arg: unknown) => {
      switch (arg) {
        case DataState.countries:
          return new BehaviorSubject(MOCK_COUNTRIES);
        case DataState.sectors:
          return new BehaviorSubject(MOCK_SECTORS);
        case OrganizationState.organization:
          return organization$;
        case UserState.acceptedTerms:
          return acceptedTerms$;
        case UserState.organization:
          return organizationSnapshot$;
        default:
          return new BehaviorSubject(null);
      }
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const createComponent = (pages: OnboardingPage[] = [], page?: OnboardingPage): void => {
    fixture = TestBed.createComponent(OnboardingComponent);
    component = fixture.componentInstance;

    component.onboardingPages = pages;
    if (page) component.page = page;

    fixture.detectChanges();
  };

  const dispatchInputEvent = async (value: string) => {
    const input = fixture.nativeElement.querySelector('.input input');
    input.value = value;
    input.dispatchEvent(new Event('input'));
    return fixture.detectChanges();
  };

  it('should create', () => {
    createComponent([ONBOARDING_PAGE]);
    expect(component).toBeTruthy();
  });

  it('should render correct UI elements based on config', () => {
    createComponent([ONBOARDING_PAGE_INTRO, ONBOARDING_SPINNER_PAGE]);

    expect(fixture.nativeElement.querySelector('.progress')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.title')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.subtitle')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.input')).toBeNull();
    expect(fixture.nativeElement.querySelector('.continue')).toBeTruthy();
  });

  it('should render correct UI elements based on config with field', () => {
    createComponent([ONBOARDING_PAGE, ONBOARDING_SPINNER_PAGE]);

    expect(fixture.nativeElement.querySelector('.progress')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.title')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.subtitle')).toBeNull();
    expect(fixture.nativeElement.querySelector('.input')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.continue')).toBeTruthy();
  });

  it('should render dropdown elements', () => {
    const field: OnboardingField = { path: 'sector', type: 'sectors', placeholder: 'Sector placeholder' };
    const page: OnboardingPage = { id: 'sector', title: 'Sector', field };

    createComponent([page, ONBOARDING_SPINNER_PAGE]);

    const select = fixture.debugElement.query(By.directive(MatSelect));
    select.nativeElement.click();
    fixture.detectChanges();

    const options = fixture.debugElement.queryAll(By.directive(MatOption));
    expect(options).toHaveLength(2);
    expect(options[0].nativeElement.innerHTML).toContain('Sector 1');
    expect(options[1].nativeElement.innerHTML).toContain('Sector 2');
  });

  it('should wait for valid input before allowing the user to continue', async () => {
    createComponent([ONBOARDING_PAGE, ONBOARDING_SPINNER_PAGE]);

    const button = fixture.nativeElement.querySelector('.continue');
    expect(button).toHaveProperty('disabled', true);

    await dispatchInputEvent('Test');
    expect(button).toHaveProperty('disabled', false);

    await dispatchInputEvent('');
    expect(button).toHaveProperty('disabled', true);
  });

  it('should wait for accepted terms before allowing the user to continue', async () => {
    createComponent([ONBOARDING_PAGE_TERMS, ONBOARDING_SPINNER_PAGE]);

    const compiled = fixture.debugElement.nativeElement;
    const termsCheckbox: HTMLInputElement = compiled.querySelector('input[id="terms"]');
    const button = fixture.nativeElement.querySelector('.continue');

    // Terms not yet selected, button disabled.
    expect(button).toHaveProperty('disabled', true);
    expect(termsCheckbox.checked).toEqual(false);

    termsCheckbox.click();
    fixture.detectChanges();

    // Terms accepted, button enabled.
    expect(button).toHaveProperty('disabled', false);
    expect(termsCheckbox.checked).toEqual(true);

    termsCheckbox.click();
    fixture.detectChanges();

    // Terms deselected, button disabled.
    expect(button).toHaveProperty('disabled', true);
    expect(termsCheckbox.checked).toEqual(false);
  });

  it('should log next button clicks', () => {
    createComponent([ONBOARDING_PAGE_TERMS, ONBOARDING_SPINNER_PAGE], ONBOARDING_PAGE_TERMS);
    const termsCheckbox: HTMLInputElement = fixture.debugElement.nativeElement.querySelector('input[id="terms"]');
    const button = fixture.nativeElement.querySelector('.continue');

    // Accept terms
    termsCheckbox.click();
    fixture.detectChanges();

    jest.advanceTimersByTime(1000);

    button.click();
    fixture.detectChanges();

    expect(loggingService.logEvent).toHaveBeenNthCalledWith(1, 'termsOnboardingPageView', {
      category: PAGE_TIMING_LOGGING_CATEGORY,
      value: 1000,
    });
    expect(loggingService.logEvent).toHaveBeenNthCalledWith(2, 'OnboardingNextClick', {
      category: ONBOARDING_LOGGING_CATEGORY,
      label: 'terms',
    });
  });

  it('should navigate to the wizard after loading screen', async () => {
    createComponent([ONBOARDING_PAGE_INTRO, ONBOARDING_PAGE, ONBOARDING_SPINNER_PAGE]);
    const routerSpy = jest.spyOn(router, 'navigateByUrl');

    fixture.nativeElement.querySelector('.continue').click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(routerSpy).not.toHaveBeenCalled();

    await dispatchInputEvent('Test');

    fixture.nativeElement.querySelector('.continue').click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.spinner-container')).toBeTruthy();

    organization$.next(MOCK_ORGANIZATION_ACCOUNT);
    jest.runAllTimers();

    expect(routerSpy).toHaveBeenCalledWith('/wizard');
  });

  it('should not show the back button on the loading screen', async () => {
    createComponent([ONBOARDING_PAGE_INTRO, ONBOARDING_PAGE, ONBOARDING_PAGE, ONBOARDING_SPINNER_PAGE]);

    fixture.nativeElement.querySelector('.continue').click();
    fixture.detectChanges();
    await fixture.whenStable();

    await dispatchInputEvent('Test');

    fixture.nativeElement.querySelector('.continue').click();
    fixture.detectChanges();
    await fixture.whenStable();

    // Second onboarding page should have a back button
    expect(fixture.nativeElement.querySelector('.previous button')).toBeTruthy();

    await dispatchInputEvent('Test');

    fixture.nativeElement.querySelector('.continue').click();
    fixture.detectChanges();
    await fixture.whenStable();

    // Loading screen should not have a back button
    expect(fixture.nativeElement.querySelector('.spinner-container')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.previous button')).toBeFalsy();
  });

  it('should accept terms and create an organization when the last page has been reached', async () => {
    createComponent([ONBOARDING_PAGE_TERMS, ONBOARDING_PAGE, ONBOARDING_SPINNER_PAGE]);
    dispatch.mockReset(); // Ignore initial setup actions

    const terms: HTMLInputElement = fixture.nativeElement.querySelector('input[id="terms"]');
    terms.click();
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.continue').click();
    fixture.detectChanges();
    await fixture.whenStable();

    await dispatchInputEvent('Test');
    fixture.detectChanges();

    fixture.nativeElement.querySelector('.continue').click();
    fixture.detectChanges();
    await fixture.whenStable();

    // Casting type here as not testing all steps of the flow.
    const organization = { country: null, name: 'Test', sector: null, vat: null } as unknown as OrganizationAccount;
    expect(dispatch).toHaveBeenCalledWith([new AcceptTerms(true), new CreateOrganization(organization)]);
  });

  describe('terms only', () => {
    it('should present only the terms page if the user has already created an organization', () => {
      organizationSnapshot$.next(MOCK_ORGANIZATION_ACCOUNT_SNAPSHOT);
      createComponent();

      const terms: HTMLInputElement = fixture.nativeElement.querySelector('input[id="terms"]');
      expect(terms).toBeTruthy();
    });

    it('should only dispatch the accept terms action once complete', () => {
      organizationSnapshot$.next(MOCK_ORGANIZATION_ACCOUNT_SNAPSHOT);
      createComponent();
      dispatch.mockReset(); // Ignore initial setup actions

      fixture.nativeElement.querySelector('input[id="terms"]').click();
      fixture.detectChanges();

      fixture.nativeElement.querySelector('.continue').click();
      fixture.detectChanges();

      expect(dispatch).toHaveBeenCalledWith([new AcceptTerms(true)]);
    });
  });
});
