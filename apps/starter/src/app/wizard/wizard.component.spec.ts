// Copyright 2022 Meta Mind AB
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap, ParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { NgxsModule, Store } from '@ngxs/store';
import { Angulartics2Module } from 'angulartics2';
import { LottieModule } from 'ngx-lottie';

import { DateTime } from 'luxon';
import { BehaviorSubject } from 'rxjs';

import { MOCK_ROUTES } from '../app-routing.mocks';
import { MockIconsModule } from '../core/icons/icons.mocks';
import { FetchImpact } from '../core/impact/impact.actions';
import { LoggingService } from '../core/logging/logging.service';
import { NAVIGATION_LOGGING_CATEGORY, PAGE_TIMING_LOGGING_CATEGORY } from '../core/logging/logging.utils';
import { MOCK_ORGANIZATION_ACCOUNT } from '../core/organization/organization.mocks';
import { OrganizationState } from '../core/organization/organization.state';
import { isNonNullable } from '../core/utils/rxjs.utils';

import { BoldifyPipe } from './boldify.pipe';
import { FetchWizardEntry, SaveWizardEntry } from './ngxs/wizard.actions';
import { MOCK_WIZARD_ENTRY, MOCK_WIZARD_ENTRY_RESPONSE } from './ngxs/wizard.mocks';
import { TimePeriod, WizardEntry, WizardEntryResponse } from './ngxs/wizard.model';
import { WizardState } from './ngxs/wizard.state';
import { WizardDatepickerFieldComponent } from './wizard-datepicker-field/wizard-datepicker-field.component';
import { WizardDatepickerFieldModule } from './wizard-datepicker-field/wizard-datepicker-field.module';
import { WizardExpensesComponent } from './wizard-expenses/wizard-expenses.component';
import { WizardLoaderComponent } from './wizard-loader/wizard-loader.component';
import { MOCK_LOTTIE_PLAYER } from './wizard-loader/wizard-loader.mocks';
import { WizardNavigationComponent } from './wizard-navigation/wizard-navigation.component';
import { WizardProgressComponent } from './wizard-progress/wizard-progress.component';
import { WizardProgressModule } from './wizard-progress/wizard-progress.module';
import { WizardSingleFieldComponent } from './wizard-single-field/wizard-single-field.component';
import { WizardSingleFieldModule } from './wizard-single-field/wizard-single-field.module';
import { WizardUnitFieldComponent } from './wizard-unit-field/wizard-unit-field.component';
import { DASHBOARD_URL, WizardComponent } from './wizard.component';
import { EMPLOYEES_PAGE_ID, NUMBER_OF_EMPLOYEES_WARNING } from './wizard.config';
import { EXPENSE_CATEGORIES } from './wizard.expenses';
import { DatepickerField, Page, QuestionPage, SingleField, SplashPage, UnitField } from './wizard.types';

const MOCK_WIZARD_ENTRY_ID = MOCK_WIZARD_ENTRY_RESPONSE._id;

const SPLASH_PAGE: SplashPage = {
  id: 'splash',
  type: 'splash',
  trilogy: 1,
  title: 'Splash page',
};

const NUMBER_FIELD: SingleField = { path: 'numberOfEmployees', type: 'number', placeholder: 'Text placeholder' };
const NUMBER_PAGE: QuestionPage = {
  id: 'number',
  type: 'question',
  trilogy: 2,
  title: 'Number page',
  fields: [NUMBER_FIELD],
};

const DATE_FIELD: DatepickerField = { path: 'timePeriod', type: 'date', placeholder: 'Text placeholder' };
const DATE_PAGE: QuestionPage = {
  id: 'date',
  type: 'question',
  trilogy: 2,
  title: 'Date page',
  fields: [DATE_FIELD],
};

const UNIT_FIELD: UnitField = { path: 'spend', type: 'unit', units: 'currency' };
const UNIT_PAGE: QuestionPage = {
  id: 'unit',
  type: 'question',
  trilogy: 2,
  title: 'Unit page',
  fields: [UNIT_FIELD],
};

describe('WizardComponent', () => {
  let dispatch: jest.SpyInstance;
  let router: Router;
  let store: Store;
  let loggingService: LoggingService;
  let logEvent: jest.SpyInstance;

  let entry$: BehaviorSubject<WizardEntry | null>;
  let response$: BehaviorSubject<WizardEntryResponse | null>;
  let saving$: BehaviorSubject<boolean>;
  let snapshot: { paramMap: ParamMap };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    snapshot = { paramMap: convertToParamMap({}) };

    await TestBed.configureTestingModule({
      declarations: [
        BoldifyPipe,
        WizardComponent,
        WizardNavigationComponent,
        WizardDatepickerFieldComponent,
        WizardUnitFieldComponent,
        WizardExpensesComponent,
        WizardLoaderComponent,
      ],
      imports: [
        LottieModule.forRoot({ player: () => MOCK_LOTTIE_PLAYER }),
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MockIconsModule,
        NgxsModule.forRoot([], { developmentMode: true }),
        NoopAnimationsModule,
        WizardDatepickerFieldModule,
        WizardProgressModule,
        WizardSingleFieldModule,
        ReactiveFormsModule,
        Angulartics2Module.forRoot(),
        RouterTestingModule.withRoutes(MOCK_ROUTES),
      ],
      providers: [{ provide: ActivatedRoute, useValue: { firstChild: { snapshot } } }],
    }).compileComponents();

    router = TestBed.inject(Router);
    store = TestBed.inject(Store);
    loggingService = TestBed.inject(LoggingService);

    logEvent = jest.spyOn(loggingService, 'logEvent');
    dispatch = jest.spyOn(store, 'dispatch');
    entry$ = new BehaviorSubject<WizardEntry | null>(null);
    response$ = new BehaviorSubject<WizardEntryResponse | null>(null);
    saving$ = new BehaviorSubject<boolean>(false);

    jest.spyOn(store, 'select').mockImplementation((selector: unknown) => {
      switch (selector) {
        case OrganizationState.organization:
          return new BehaviorSubject(MOCK_ORGANIZATION_ACCOUNT);
        case WizardState.entry:
          return entry$;
        case WizardState.saving:
          return saving$;
        case WizardState.response:
          return response$;
        default:
          return new BehaviorSubject(null);
      }
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const createComponent = (pages: Page[] = [], page?: Page): ComponentFixture<WizardComponent> => {
    const fixture = TestBed.createComponent(WizardComponent);
    const component = fixture.componentInstance;

    component.pages = pages;
    if (page) component.page = page;

    fixture.detectChanges();
    return fixture;
  };

  it('should create the component', () => {
    const fixture = createComponent();
    expect(fixture.componentInstance).toBeTruthy();
  });

  describe('setup', () => {
    it('should not have any duplicate normIds set in the expenses', () => {
      const normIds = EXPENSE_CATEGORIES.reduce<string[]>(
        (ids, { subcategories }) => [...ids, ...subcategories.map(({ normId }) => normId).filter(isNonNullable)],
        []
      );

      expect(new Set(normIds).size).toEqual(normIds.length);
    });

    it('should default the currency value to that of the organization', () => {
      const { componentInstance: component } = createComponent([UNIT_PAGE, NUMBER_PAGE]);
      expect(component.form.value).toHaveProperty('spend', { value: null, unit: 'SEK' });
    });

    it('should fetch (and sync) an entry if an id param is set in the route', async () => {
      snapshot.paramMap = convertToParamMap({ id: MOCK_WIZARD_ENTRY_ID });
      entry$.next(MOCK_WIZARD_ENTRY);

      const { componentInstance: component } = createComponent([NUMBER_PAGE]);
      expect(dispatch).toHaveBeenCalledWith(new FetchWizardEntry(MOCK_WIZARD_ENTRY_ID));
      expect(component.form.value).toHaveProperty('numberOfEmployees', MOCK_WIZARD_ENTRY.numberOfEmployees);
    });
  });

  describe('pages', () => {
    it('should render the first page in the pages input', () => {
      const fixture = createComponent([NUMBER_PAGE]);
      const title: HTMLHeadingElement = fixture.nativeElement.querySelector('h1');

      expect(title.innerHTML).toContain('Number page');
    });

    it('should render the page from the page input', () => {
      const fixture = createComponent([NUMBER_PAGE, UNIT_PAGE], UNIT_PAGE);
      const title: HTMLHeadingElement = fixture.nativeElement.querySelector('h1');

      expect(title.innerHTML).toContain('Unit page');
    });

    it('should render a splash page if provided', () => {
      const fixture = createComponent([SPLASH_PAGE]);
      const splash: HTMLElement = fixture.nativeElement.querySelector('.splash');
      expect(splash).toBeTruthy();
    });

    it('should render a single field if provided', () => {
      const fixture = createComponent([NUMBER_PAGE]);
      const field = fixture.debugElement.query(By.directive(WizardSingleFieldComponent));
      expect(field.componentInstance).toHaveProperty('field', NUMBER_FIELD);
    });

    it('should render an unit field if provided', () => {
      const fixture = createComponent([UNIT_PAGE]);
      const field = fixture.debugElement.query(By.directive(WizardUnitFieldComponent));
      expect(field.componentInstance).toHaveProperty('field', UNIT_FIELD);
    });

    it('should render a date field if provided', () => {
      const fixture = createComponent([DATE_PAGE]);
      const field = fixture.debugElement.query(By.directive(WizardDatepickerFieldComponent));
      expect(field.componentInstance).toHaveProperty('field', DATE_FIELD);
    });

    it('should set the eyebrow of the field to the formatted date range', () => {
      const timePeriod: TimePeriod = {
        startDate: `${DateTime.utc(2000, 1, 1)}`,
        endDate: `${DateTime.utc(2000, 12, 31)}`,
      };

      const fixture = createComponent([NUMBER_PAGE]);
      fixture.componentInstance.form.patchValue({ timePeriod });
      fixture.detectChanges();

      const field = fixture.debugElement.query(By.directive(WizardSingleFieldComponent));
      expect(field.componentInstance.eyebrow).toEqual('From 1 January 2000 to 31 December 2000');
    });

    it('should only calculate question pages in the progress', () => {
      const { debugElement } = createComponent([SPLASH_PAGE, NUMBER_PAGE, UNIT_PAGE, SPLASH_PAGE], UNIT_PAGE);

      const query = By.directive(WizardProgressComponent);
      const progressbar: WizardProgressComponent = debugElement.query(query).componentInstance;
      expect(progressbar).toHaveProperty('current', 2);
      expect(progressbar).toHaveProperty('max', 2);
      expect(progressbar).toHaveProperty('label', '2 of 2');
    });

    it('should only calculate non-hidden question pages in the progress', () => {
      const hideIf = ({ numberOfEmployees }: WizardEntry) => numberOfEmployees === 10;
      const skip: QuestionPage = { ...NUMBER_PAGE, id: 'skip', hideIf };
      const fixture = createComponent([NUMBER_PAGE, skip, UNIT_PAGE]);

      const query = By.directive(WizardProgressComponent);
      const progressbar: WizardProgressComponent = fixture.debugElement.query(query).componentInstance;
      expect(progressbar).toHaveProperty('max', 3);

      fixture.componentInstance.form.patchValue({ numberOfEmployees: 10 });
      fixture.detectChanges();
      expect(progressbar).toHaveProperty('max', 2);
    });
  });

  describe('next', () => {
    it('should render the next page after clicking the next button', () => {
      const fixture = createComponent([NUMBER_PAGE, UNIT_PAGE]);
      const navigation = fixture.debugElement.query(By.directive(WizardNavigationComponent));
      const title: HTMLHeadingElement = fixture.nativeElement.querySelector('h1');

      expect(title.innerHTML).toContain('Number page');

      navigation.componentInstance.next.emit();
      fixture.detectChanges();

      expect(title.innerHTML).toContain('Unit page');
    });

    it('should log next button clicks', () => {
      const fixture = createComponent([NUMBER_PAGE, UNIT_PAGE]);
      const navigation = fixture.debugElement.query(By.directive(WizardNavigationComponent));

      jest.advanceTimersByTime(1000);
      navigation.componentInstance.next.emit();
      fixture.detectChanges();

      expect(logEvent).toHaveBeenNthCalledWith(1, 'numberWizardPageView', {
        category: PAGE_TIMING_LOGGING_CATEGORY,
        value: 1000,
      });
      expect(logEvent).toHaveBeenNthCalledWith(2, 'NextClick', {
        category: NAVIGATION_LOGGING_CATEGORY,
        label: 'number',
      });
    });

    it('should log unique page labels on next button clicks', () => {
      const fixture = createComponent([NUMBER_PAGE, UNIT_PAGE]);
      const navigation = fixture.debugElement.query(By.directive(WizardNavigationComponent));

      jest.advanceTimersByTime(1000);
      navigation.componentInstance.next.emit();
      fixture.detectChanges();

      expect(logEvent).toHaveBeenNthCalledWith(1, 'numberWizardPageView', {
        category: PAGE_TIMING_LOGGING_CATEGORY,
        value: 1000,
      });
      expect(logEvent).toHaveBeenNthCalledWith(2, 'NextClick', {
        category: NAVIGATION_LOGGING_CATEGORY,
        label: 'number',
      });

      jest.advanceTimersByTime(2000);
      navigation.componentInstance.next.emit();
      fixture.detectChanges();

      expect(logEvent).toHaveBeenNthCalledWith(3, 'unitWizardPageView', {
        category: PAGE_TIMING_LOGGING_CATEGORY,
        value: 2000,
      });
      expect(logEvent).toHaveBeenNthCalledWith(4, 'NextClick', {
        category: NAVIGATION_LOGGING_CATEGORY,
        label: 'unit',
      });
      expect(logEvent).toHaveBeenCalledTimes(4);
    });

    it('should ignore pages hidden by the config', () => {
      const hidden: QuestionPage = { ...NUMBER_PAGE, id: 'skip', hideIf: () => true };
      const fixture = createComponent([NUMBER_PAGE, hidden, UNIT_PAGE]);
      const navigation = fixture.debugElement.query(By.directive(WizardNavigationComponent));
      const title: HTMLHeadingElement = fixture.nativeElement.querySelector('h1');

      expect(title.innerHTML).toContain('Number page');

      navigation.componentInstance.next.emit();
      fixture.detectChanges();

      expect(title.innerHTML).toContain('Unit page');
    });

    it('should return the user to the previously visited page if reloaded', () => {
      snapshot.paramMap = convertToParamMap({ id: MOCK_WIZARD_ENTRY_ID });
      entry$.next(MOCK_WIZARD_ENTRY);

      // Naviate to second page
      const fixture = createComponent([NUMBER_PAGE, UNIT_PAGE]);
      const navigation = fixture.debugElement.query(By.directive(WizardNavigationComponent));
      navigation.componentInstance.next.emit();
      fixture.detectChanges();

      const title: HTMLHeadingElement = fixture.nativeElement.querySelector('h1');
      expect(title.innerHTML).toContain('Unit page');
      fixture.destroy();

      // 'Reload' page
      const fixture2 = createComponent([NUMBER_PAGE, UNIT_PAGE]);
      const title2: HTMLHeadingElement = fixture2.nativeElement.querySelector('h1');
      expect(title2.innerHTML).toContain('Unit page');
      fixture2.destroy();

      // 'Revisit' with a different entry id
      snapshot.paramMap = convertToParamMap({ id: `${MOCK_WIZARD_ENTRY_ID}_2` });
      const fixture3 = createComponent([NUMBER_PAGE, UNIT_PAGE]);
      const title3: HTMLHeadingElement = fixture3.nativeElement.querySelector('h1');
      expect(title3.innerHTML).toContain('Number page');
    });
  });

  describe('focusout', () => {
    it('should call saveOnFocusOut callback on focusout', () => {
      const fixture = createComponent([NUMBER_PAGE, UNIT_PAGE]);

      dispatch.mockReset();

      jest.spyOn(fixture.componentInstance, 'saveOnFocusOut');

      const input = fixture.nativeElement.querySelector('input[id="numberOfEmployees"]');
      input.focus();
      input.value = 10;
      input.dispatchEvent(new Event('input'));
      input.blur();

      fixture.detectChanges();

      expect(fixture.componentInstance.saveOnFocusOut).toHaveBeenCalledTimes(1);
    });

    it('should not dispatch a save action to the store on focusout with invalid form data', () => {
      const fixture = createComponent([NUMBER_PAGE, UNIT_PAGE]);
      const fieldsEl = fixture.nativeElement.querySelector('.fields__inner');

      dispatch.mockReset();

      fixture.componentInstance.form.get('numberOfEmployees')?.setValue(-10);
      fieldsEl.dispatchEvent(new Event('focusout'));

      fixture.detectChanges();

      expect(dispatch).not.toHaveBeenCalledWith();
    });
  });

  describe('save', () => {
    it('should dispatch a save action to the store on navigation', () => {
      const fixture = createComponent([NUMBER_PAGE, UNIT_PAGE]);
      const navigation = fixture.debugElement.query(By.directive(WizardNavigationComponent));

      dispatch.mockReset();

      fixture.componentInstance.form.get('numberOfEmployees')?.setValue(10);
      fixture.componentInstance.form.markAsDirty();
      navigation.componentInstance.next.emit();

      fixture.detectChanges();

      expect(dispatch).toHaveBeenCalledWith(
        new SaveWizardEntry(expect.objectContaining({ numberOfEmployees: 10 }), null)
      );
    });

    it('should wait for a previous save action to complete before dispatching the next', () => {
      const fixture = createComponent([NUMBER_PAGE, UNIT_PAGE]);
      const navigation = fixture.debugElement.query(By.directive(WizardNavigationComponent));

      dispatch.mockReset();

      fixture.componentInstance.form.get('numberOfEmployees')?.setValue(10);
      fixture.componentInstance.form.markAsDirty();
      navigation.componentInstance.next.emit();
      fixture.detectChanges();

      expect(dispatch).toHaveBeenCalledWith(
        new SaveWizardEntry(expect.objectContaining({ numberOfEmployees: 10 }), null)
      );

      dispatch.mockReset();
      saving$.next(true);

      fixture.componentInstance.form.get('numberOfEmployees')?.setValue(20);
      fixture.componentInstance.form.markAsDirty();
      navigation.componentInstance.next.emit();
      fixture.detectChanges();

      expect(dispatch).not.toHaveBeenCalled();

      saving$.next(false);
      expect(dispatch).toHaveBeenCalledWith(
        new SaveWizardEntry(expect.objectContaining({ numberOfEmployees: 20 }), null)
      );
    });

    it('should not dispatch a save action to the store on navigation with no changes', () => {
      const fixture = createComponent([NUMBER_PAGE, UNIT_PAGE]);
      const navigation = fixture.debugElement.query(By.directive(WizardNavigationComponent));

      dispatch.mockReset();

      navigation.componentInstance.next.emit();

      expect(dispatch).not.toHaveBeenCalled();
    });

    it('should dispatch a save action with the current id to the store on navigation', () => {
      snapshot.paramMap = convertToParamMap({ id: MOCK_WIZARD_ENTRY_ID });
      entry$.next(MOCK_WIZARD_ENTRY);

      const fixture = createComponent([NUMBER_PAGE, UNIT_PAGE]);
      const navigation = fixture.debugElement.query(By.directive(WizardNavigationComponent));

      dispatch.mockReset();

      fixture.componentInstance.form.get('numberOfEmployees')?.setValue(10);
      fixture.componentInstance.form.markAsDirty();
      navigation.componentInstance.next.emit();
      fixture.detectChanges();

      expect(dispatch).toHaveBeenCalledWith(
        new SaveWizardEntry(expect.objectContaining({ numberOfEmployees: 10 }), MOCK_WIZARD_ENTRY_ID)
      );
    });

    it('should navigate to /wizard/:id when a new entry has been saved for the first time', () => {
      const fixture = createComponent([NUMBER_PAGE, UNIT_PAGE]);
      const navigation = fixture.debugElement.query(By.directive(WizardNavigationComponent));
      const navigateByUrl = jest.spyOn(router, 'navigateByUrl');

      fixture.componentInstance.form.get('numberOfEmployees')?.setValue(10);
      fixture.componentInstance.form.markAsDirty();
      navigation.componentInstance.next.emit();

      response$.next(MOCK_WIZARD_ENTRY_RESPONSE);
      expect(navigateByUrl).toHaveBeenLastCalledWith(`/wizard/${MOCK_WIZARD_ENTRY_RESPONSE._id}`, { replaceUrl: true });
    });

    it('should navigate to the homepage when the submission is complete', () => {
      const fixture = createComponent([NUMBER_PAGE, UNIT_PAGE]);
      const navigation = fixture.debugElement.query(By.directive(WizardNavigationComponent));
      const routerSpy = jest.spyOn(router, 'navigateByUrl');

      // First question page
      expect(routerSpy).not.toHaveBeenCalled();
      expect(fixture.debugElement.query(By.directive(WizardLoaderComponent))).toBeNull();

      // Second (and final) question page
      navigation.componentInstance.next.emit();
      expect(routerSpy).not.toHaveBeenCalled();
      expect(fixture.debugElement.query(By.directive(WizardLoaderComponent))).toBeNull();

      // Loading page
      navigation.componentInstance.next.emit();
      fixture.detectChanges();
      expect(routerSpy).not.toHaveBeenCalled();
      expect(fixture.debugElement.query(By.directive(WizardLoaderComponent))).toBeTruthy();

      // Redirect (and trigger impact fetch) as submission complete
      jest.runAllTimers();
      response$.next(MOCK_WIZARD_ENTRY_RESPONSE);
      expect(dispatch).toHaveBeenCalledWith(new FetchImpact(MOCK_WIZARD_ENTRY_RESPONSE));
      expect(routerSpy).toHaveBeenCalledWith(DASHBOARD_URL);
    });

    it('should not dispatch a save action to the store on navigation with invalid form data', () => {
      const fixture = createComponent([NUMBER_PAGE, UNIT_PAGE]);
      const navigation = fixture.debugElement.query(By.directive(WizardNavigationComponent));

      dispatch.mockReset();

      fixture.componentInstance.form.get('numberOfEmployees')?.setValue(-10);
      fixture.componentInstance.form.markAsDirty();
      navigation.nativeElement.click();

      fixture.detectChanges();

      expect(navigation.nativeElement).toBeTruthy();
      expect(dispatch).not.toHaveBeenCalledWith();
    });
  });

  describe('previous', () => {
    it('should render the previous page after clicking the previous button', () => {
      const fixture = createComponent([NUMBER_PAGE, UNIT_PAGE, DATE_PAGE], DATE_PAGE);
      const navigation = fixture.debugElement.query(By.directive(WizardNavigationComponent));
      const title: HTMLHeadingElement = fixture.nativeElement.querySelector('h1');

      expect(title.innerHTML).toContain('Date page');

      navigation.componentInstance.previous.emit();
      fixture.detectChanges();

      expect(title.innerHTML).toContain('Unit page');
    });

    it('should navigate to dashboard after clicking the previous button on first page', () => {
      const fixture = createComponent([NUMBER_PAGE, UNIT_PAGE]);
      const navigation = fixture.debugElement.query(By.directive(WizardNavigationComponent));
      const title: HTMLHeadingElement = fixture.nativeElement.querySelector('h1');
      const routerSpy = jest.spyOn(router, 'navigateByUrl');

      expect(title.innerHTML).toContain('Number page');

      navigation.componentInstance.previous.emit();
      fixture.detectChanges();

      expect(routerSpy).toHaveBeenCalledWith(DASHBOARD_URL);
    });

    it('should navigate to dashboard after clicking the previous button on second page', () => {
      const fixture = createComponent([NUMBER_PAGE, UNIT_PAGE], UNIT_PAGE);
      const navigation = fixture.debugElement.query(By.directive(WizardNavigationComponent));
      const title: HTMLHeadingElement = fixture.nativeElement.querySelector('h1');
      const routerSpy = jest.spyOn(router, 'navigateByUrl');

      expect(title.innerHTML).toContain('Unit page');

      navigation.componentInstance.previous.emit();
      fixture.detectChanges();

      expect(routerSpy).toHaveBeenCalledWith(DASHBOARD_URL);
    });

    it('should hide the previous button if on the first question', () => {
      const fixture = createComponent([NUMBER_PAGE, UNIT_PAGE]);
      const navigation = fixture.debugElement.query(By.directive(WizardNavigationComponent));

      expect(navigation.componentInstance.previousLabel).toBeUndefined();
    });

    it('should log previous button clicks', () => {
      const fixture = createComponent([NUMBER_PAGE, UNIT_PAGE], UNIT_PAGE);
      const navigation = fixture.debugElement.query(By.directive(WizardNavigationComponent));

      expect(navigation.componentInstance.previousLabel).toBeDefined();

      jest.advanceTimersByTime(1000);
      navigation.componentInstance.previous.emit();
      fixture.detectChanges();

      expect(logEvent).toHaveBeenCalledTimes(2);
      expect(logEvent).toHaveBeenNthCalledWith(1, 'unitWizardPageView', {
        category: PAGE_TIMING_LOGGING_CATEGORY,
        value: 1000,
      });
      expect(logEvent).toHaveBeenNthCalledWith(2, 'PreviousClick', {
        category: NAVIGATION_LOGGING_CATEGORY,
        label: 'unit',
      });
    });
  });

  describe('exit', () => {
    it('should navigate to the home page when Save & exit button is clicked', () => {
      const fixture = createComponent([NUMBER_PAGE, UNIT_PAGE]);
      const navigation = fixture.debugElement.query(By.directive(WizardNavigationComponent));
      const routerSpy = jest.spyOn(router, 'navigateByUrl');

      navigation.componentInstance.exit.emit();
      response$.next(MOCK_WIZARD_ENTRY_RESPONSE);
      fixture.detectChanges();

      expect(dispatch).toHaveBeenCalledWith(new FetchImpact(MOCK_WIZARD_ENTRY_RESPONSE));
      expect(routerSpy).toHaveBeenCalledWith(DASHBOARD_URL);
    });

    it('should log exit button clicks', () => {
      const fixture = createComponent([NUMBER_PAGE, UNIT_PAGE]);
      const navigation = fixture.debugElement.query(By.directive(WizardNavigationComponent));

      navigation.componentInstance.exit.emit();
      response$.next(MOCK_WIZARD_ENTRY_RESPONSE);
      fixture.detectChanges();

      expect(logEvent).toHaveBeenNthCalledWith(1, 'numberWizardPageView', {
        category: PAGE_TIMING_LOGGING_CATEGORY,
        value: 0,
      });
      expect(logEvent).toHaveBeenNthCalledWith(2, 'ExitClick', {
        category: NAVIGATION_LOGGING_CATEGORY,
        label: 'number',
      });
    });
  });

  describe('trilogy', () => {
    it('should highlight the active page within the trilogy', () => {
      const fixture = createComponent([SPLASH_PAGE, NUMBER_PAGE], NUMBER_PAGE);
      const trilogyItems = fixture.nativeElement.querySelectorAll('.trilogy__item');

      expect(trilogyItems).toHaveLength(3);
      expect(trilogyItems[0].getAttribute('aria-current')).toEqual(null);
      expect(trilogyItems[1].getAttribute('aria-current')).toEqual('step');
      expect(trilogyItems[2].getAttribute('aria-current')).toEqual(null);
    });

    it('should jumpt to the first question of the trilogy if clicked on', () => {
      const oneSplash: Page = { ...SPLASH_PAGE, trilogy: 1 };
      const oneNumber: Page = { ...NUMBER_PAGE, trilogy: 1 };
      const twoNumber: Page = { ...NUMBER_PAGE, title: 'Trilogy 2', trilogy: 2 };
      const twoDate: Page = { ...DATE_PAGE, trilogy: 2 };
      const threeSplash: Page = { ...SPLASH_PAGE, trilogy: 3 };
      const threeNumber: Page = { ...NUMBER_PAGE, trilogy: 3 };

      const fixture = createComponent([oneSplash, oneNumber, twoNumber, twoDate, threeSplash, threeNumber]);
      const secondButton = fixture.nativeElement.querySelectorAll('.trilogy__item')[1];
      const title = fixture.nativeElement.querySelector('h1');

      secondButton.click();
      fixture.detectChanges();

      expect(secondButton.getAttribute('aria-current')).toEqual('step');
      expect(title.innerHTML).toContain('Trilogy 2');
    });
  });

  describe('warnings', () => {
    it('should show a warning when more than 50 employees are entered', () => {
      const fixture = createComponent([{ ...NUMBER_PAGE, id: EMPLOYEES_PAGE_ID }]);
      const navigation = fixture.debugElement.query(By.directive(WizardNavigationComponent));
      expect(navigation.componentInstance).toHaveProperty('warning', null);

      fixture.componentInstance.form.get('numberOfEmployees')?.setValue(50);
      fixture.detectChanges();
      expect(navigation.componentInstance).toHaveProperty('warning', null);

      fixture.componentInstance.form.get('numberOfEmployees')?.setValue(51);
      fixture.detectChanges();
      expect(navigation.componentInstance).toHaveProperty('warning', NUMBER_OF_EMPLOYEES_WARNING);
    });
  });
});
