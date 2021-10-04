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

import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { Select, Store } from '@ngxs/store';

import { BehaviorSubject, combineLatest, forkJoin, fromEvent, merge, Observable, of, Subscription } from 'rxjs';
import { delay, distinctUntilKeyChanged, filter, map, startWith, switchMap, switchMapTo, take } from 'rxjs/operators';

import { FetchImpact } from '../core/impact/impact.actions';
import { LoggingService } from '../core/logging/logging.service';
import { NAVIGATION_LOGGING_CATEGORY, PAGE_TIMING_LOGGING_CATEGORY } from '../core/logging/logging.utils';
import { OrganizationAccount } from '../core/organization/organization.model';
import { OrganizationState } from '../core/organization/organization.state';
import { formatTimePeriod } from '../core/utils/dates.utils';
import { isNonNullable } from '../core/utils/rxjs.utils';

import { ClearWizardEntry, FetchWizardEntry, SaveWizardEntry } from './ngxs/wizard.actions';
import { TimePeriod, WizardEntry, WizardEntryResponse } from './ngxs/wizard.model';
import { WizardState } from './ngxs/wizard.state';
import { NavigationWarning } from './wizard-navigation/wizard-navigation.component';
import { AnimationDirection, slideAnimation } from './wizard.animations';
import {
  DEFAULT_UNITS,
  EMPLOYEES_PAGE_ID,
  LOADING_PAGE,
  NUMBER_OF_EMPLOYEES_THRESHOLD,
  NUMBER_OF_EMPLOYEES_WARNING,
  PAGES,
} from './wizard.config';
import { createWizardEntryForm, Expense } from './wizard.form';
import { ExpenseField, ExpensesPage, LoadingPage, Page, PageField, QuestionPage, SplashPage } from './wizard.types';

export const DASHBOARD_URL = 'dashboard';
const LARGE_VIEWPORT_BREAKPOINT = 1024; // px
const LOCAL_STORAGE_KEY = 'wizard/position';
const SHOW_LOADER_FOR_AT_LEAST = 3000; // 3 seconds

@Component({
  selector: 'n-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
  animations: [slideAnimation],
})
export class WizardComponent implements OnDestroy, OnInit {
  /** The pages to take the user through. */
  @Input() pages: Page[] = PAGES;

  /** The page to start the user on (if not the first). */
  @Input() page?: Page;

  @Select(OrganizationState.organization) organization$!: Observable<OrganizationAccount | null>;
  @Select(WizardState.entry) entry$!: Observable<WizardEntry | null>;
  @Select(WizardState.error) error$!: Observable<HttpErrorResponse | null>;
  @Select(WizardState.response) response$!: Observable<WizardEntryResponse | null>;
  @Select(WizardState.saving) saving$!: Observable<boolean>;

  /** The animation direction when a page is rendered. */
  direction = AnimationDirection.NONE;

  /** The reactive form to bind the UI to. */
  form = new FormGroup({});

  /** The names for each the trilogy sections. */
  trilogy = ['Company data', 'Fuel & energy', 'Expenses'];

  /**
   * The nth position (0-indexed) of the current page the user is on
   * (relative to {@link WizardComponent#pages}).
   */
  index$ = new BehaviorSubject(0);

  /**
   * The current page the user is on (derived from {@link WizardComponent#index$} and
   * {@link WizardComponent#pages}).
   */
  page$: Observable<Page> | undefined;

  /** The filtered pages for the flow.  */
  pages$ = new BehaviorSubject<Page[]>([]);

  /** The pages asking questions for scopes 1 & 2. */
  questions$ = this.pages$.pipe(
    map((pages) => pages.filter((page) => this.isQuestionPage(page) && page.trilogy && page.trilogy < 3))
  );

  /** Whether or not the viewport is large enough for the full two column layout. */
  largeViewport$ = fromEvent(window, 'resize').pipe(
    startWith(null),
    map(() => window.innerWidth >= LARGE_VIEWPORT_BREAKPOINT)
  );

  /** The time period set for the component, in a human-readable string (used as an eyebrow). */
  timePeriod$ = new BehaviorSubject<string | null>(null);

  /** Emits any time a warning should be provided to the user. */
  warning$?: Observable<NavigationWarning | null>;

  /** Subscriptions created within the component that need to be unsubscribed on destroy. */
  subscriptions: Subscription[] = [];

  private pageViewStartTime = 0;

  // For template
  readonly AnimationDirection = AnimationDirection;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private store: Store,
    private loggingService: LoggingService
  ) {}

  ngOnInit() {
    this.pageViewStartTime = Math.round(Date.now());

    const id = this.getEntryId();
    const action = id ? new FetchWizardEntry(id) : new ClearWizardEntry();
    const organization$ = this.organization$.pipe(filter(isNonNullable));

    const initSubscription = organization$
      .pipe(
        filter(isNonNullable),
        switchMap(() => this.store.dispatch(action)),
        switchMap(() => combineLatest([organization$, this.entry$.pipe(take(1))]))
      )
      .subscribe(([organization, entry]) => this.setup(organization, entry || undefined));

    this.subscriptions.push(initSubscription);
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  private setup(organization: OrganizationAccount, entry?: WizardEntry) {
    // Create form
    const expenseCategories = this.pages.find(this.isExpensesPage)?.categories || [];
    const expenses = expenseCategories
      .reduce<ExpenseField[]>((all, { subcategories }) => [...all, ...subcategories], [])
      .map<Expense>((field) => ({ ...field, description: field.label }));

    this.form = createWizardEntryForm(organization, expenses, entry);

    // Filter pages based on form answers
    const formSubscription = this.form.valueChanges
      .pipe(map(() => this.onFormValueChange(this.form.getRawValue())))
      .subscribe((pages) => this.pages$.next(pages));
    this.subscriptions.push(formSubscription);

    this.pages$.next(this.onFormValueChange(this.form.getRawValue()));

    // Format time period
    const timePeriod = this.form.get('timePeriod') as FormGroup | null;
    if (timePeriod) {
      const timePeriodSubscription = timePeriod.valueChanges
        .pipe(map(() => this.onTimePeriodChange(timePeriod.getRawValue())))
        .subscribe((formatted) => this.timePeriod$.next(formatted));

      this.timePeriod$.next(this.onTimePeriodChange(timePeriod.getRawValue()));
      this.subscriptions.push(timePeriodSubscription);
    }

    // Set page to start on
    const startPageId = this.page?.id || this.getEntryPagePosition();
    const startPageSubscription = this.pages$
      .pipe(take(1))
      .pipe(map((pages) => pages.findIndex(({ id }) => id === startPageId)))
      .subscribe((index) => this.index$.next(Math.max(0, index)));
    this.subscriptions.push(startPageSubscription);

    // Update chapter/question on navigation (assume loading if out of range)
    this.page$ = combineLatest([this.pages$, this.index$]).pipe(map(([pages, index]) => pages[index] || LOADING_PAGE));

    // Sync store with the form (save on navigation)
    const pageSubscription = this.page$
      .pipe(
        filter((page) => !this.isLoadingPage(page)),
        distinctUntilKeyChanged('id')
      )
      .subscribe((page) => this.onPageChange(organization, page));
    this.subscriptions.push(pageSubscription);

    // Sync browser with id (update url when entry is created)
    const responseSubscription = this.response$
      .pipe(filter(isNonNullable), distinctUntilKeyChanged('_id'))
      .subscribe((response) => this.router.navigateByUrl(`/wizard/${response._id}`, { replaceUrl: true }));
    this.subscriptions.push(responseSubscription);

    // Update page position when we route to a new entry
    const idSubscription = this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.getEntryId()),
        filter(isNonNullable),
        switchMapTo(this.page$)
      )
      .subscribe((page) => page && this.savePagePosition(page));
    this.subscriptions.push(idSubscription);

    // Sync when complete and redirect to dashboard
    const finalSubscription = this.page$
      .pipe(filter((page) => this.isLoadingPage(page)))
      .subscribe(() => this.onLoadingPage(organization));
    this.subscriptions.push(finalSubscription);

    // Sync warnings / errors
    this.warning$ = merge(
      // Reset warnings after page change
      this.page$.pipe(map(() => null)),

      // Show error from the server
      this.error$.pipe(map((error) => error && { text: error.error.message || error.message })),

      // Show warning if number of employees is over the threshold
      combineLatest([this.page$, this.form.valueChanges.pipe<WizardEntry>(startWith(this.form.getRawValue()))]).pipe(
        map(([page, { numberOfEmployees }]) =>
          page.id === EMPLOYEES_PAGE_ID && (numberOfEmployees || 0) > NUMBER_OF_EMPLOYEES_THRESHOLD
            ? NUMBER_OF_EMPLOYEES_WARNING
            : null
        )
      )
    );
  }

  /** Returns the current entry id determined by the url. */
  private getEntryId(): string | null {
    return this.activatedRoute.firstChild?.snapshot.paramMap.get('id') || null;
  }

  /** Returns the (locally) stored position for the current entry if it exists. */
  private getEntryPagePosition(): string | null {
    const id = this.getEntryId();
    return (id && this.getPagePositions()[id]) || null;
  }

  /** Returns the (locally) stored page positions for all entries. */
  private getPagePositions(): { [key: string]: string | undefined } {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '{}');
    } catch (err) {
      // Unable to retrieve from localStorage
      return {};
    }
  }

  /** Determine whether the page is an expenses menu page. */
  isExpensesPage(page: Page): page is ExpensesPage {
    return page.type === 'expenses';
  }

  /** Determine whether the page is the loading page. */
  isLoadingPage(page: Page): page is LoadingPage {
    return page.type === 'loading';
  }

  /** Determine whether the page is a question page. */
  isQuestionPage(page: Page): page is QuestionPage {
    return page.type === 'question';
  }

  /** Determine whether the page is a splash page. */
  isSplashPage(page: Page): page is SplashPage {
    return page.type === 'splash';
  }

  /** Updates the store with changes from the form (including on page change). */
  saveOnFocusOut() {
    this.organization$.subscribe((organization) => {
      if (organization && this.form.valid) this.subscriptions.push(this.save(organization).subscribe());
    });
  }

  /** Leave the wizard. */
  exit() {
    const subscription = this.organization$
      .pipe(
        filter(isNonNullable),
        switchMap((organization) => this.save(organization)),
        switchMap(() => combineLatest([this.response$.pipe(filter(isNonNullable)), this.page$ ?? of(null)]))
      )
      .subscribe(([response, page]) => {
        if (page) this.trackNavigationEventWithTiming('ExitClick', page);

        if (page) this.savePagePosition(page);

        this.store.dispatch(new FetchImpact(response));
        this.router.navigateByUrl(DASHBOARD_URL);
      });

    this.subscriptions.push(subscription);
  }

  /** Go to the previous page. */
  previous(animation = AnimationDirection.PREVIOUS) {
    this.page$?.pipe(take(1)).subscribe((page) => {
      this.trackNavigationEventWithTiming('PreviousClick', page);
    });

    // Escape hatch straight to dashboard if navigating back from intro wizard pages.
    if (this.index$.value === 0 || this.index$.value === 1) {
      this.router.navigateByUrl(DASHBOARD_URL);
    } else {
      this.direction = animation;
      this.index$.next(this.index$.value - 1);
    }
  }

  /** Go to the next page if valid input entered. */
  next(animation = AnimationDirection.NEXT) {
    this.page$?.pipe(take(1)).subscribe((page) => {
      this.trackNavigationEventWithTiming('NextClick', page);

      if (!(this.isQuestionPage(page) && this.hasErrors(page))) {
        this.direction = animation;
        this.index$.next(this.index$.value + 1);
      }
    });
  }

  /** Go to the first question page of the request trilogy section. */
  goToTrilogy(trilogy: number, pages: Page[]) {
    this.loggingService.logEvent(`Trilogy${trilogy}Click`, { category: NAVIGATION_LOGGING_CATEGORY });

    const index = pages.findIndex((page) => this.isQuestionPage(page) && page.trilogy === trilogy);

    this.direction = AnimationDirection.NONE;
    this.index$.next(index);
  }

  private trackNavigationEventWithTiming(eventName: string, page: Page) {
    // Log the time spent on this page before navigation.
    const timeSincePageViewStart = Math.round(Date.now()) - this.pageViewStartTime;
    this.loggingService.logEvent(`${page.id}WizardPageView`, {
      category: PAGE_TIMING_LOGGING_CATEGORY,
      value: timeSincePageViewStart,
    });
    this.pageViewStartTime = Math.round(Date.now());

    // Log navigation event.
    this.loggingService.logEvent(eventName, { category: NAVIGATION_LOGGING_CATEGORY, label: page.id });
  }

  /** Filters the pages based on the current form values. */
  private onFormValueChange(value: WizardEntry): Page[] {
    return this.pages.filter(({ hideIf }) => !hideIf || !hideIf(value));
  }

  /** Updates the store and redirects the user to the dashboard. */
  private onLoadingPage(organization: OrganizationAccount) {
    const subscription = forkJoin([
      this.save(organization).pipe(
        switchMapTo(this.response$.pipe(filter(isNonNullable))),
        take(1),
        switchMap((response) => {
          this.loggingService.logEvent('SubmitWizard', { category: NAVIGATION_LOGGING_CATEGORY });
          return this.store.dispatch(new FetchImpact(response));
        })
      ),
      of(null).pipe(delay(SHOW_LOADER_FOR_AT_LEAST)), // delay showing results for at least x seconds
    ]).subscribe(() => this.router.navigateByUrl(DASHBOARD_URL));

    this.subscriptions.push(subscription);
  }

  /** Updates the store with changes from the form. */
  private onPageChange(organization: OrganizationAccount, page: Page) {
    this.savePagePosition(page);
    this.subscriptions.push(this.save(organization).subscribe());
  }

  /** Returns the time period in a readable format. */
  private onTimePeriodChange(timePeriod: TimePeriod): string | null {
    const formatted = formatTimePeriod(timePeriod, 'to');
    return formatted ? `From ${formatted}` : null;
  }

  /** Sends the current form values to the store to be saved. */
  private save(organization: OrganizationAccount): Observable<void> {
    return this.saving$.pipe(
      filter((saving) => saving === false),
      take(1),
      switchMap(() => {
        const id = this.getEntryId();
        const payload: WizardEntry = {
          ...this.form.getRawValue(),
          countryOfRegistration: organization.country,
          organizationAccountId: organization._id,
        };

        const isDirty = this.form.dirty;
        this.form.markAsPristine();
        return isDirty ? this.store.dispatch(new SaveWizardEntry(payload, id)) : of(null);
      })
    );
  }

  /** Stores (locally) the current position of the user. */
  private savePagePosition(page: Page) {
    const id = this.getEntryId();

    // Do not store if we're on the final page or have not yet saved
    if (this.isLoadingPage(page) || !id) return;

    try {
      // Store current page position to localStorage
      const positions = { ...this.getPagePositions(), [id]: page.id };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(positions));
    } catch (err) {
      // Unable to save to localStorage
    }
  }

  hasErrors(page: QuestionPage) {
    return page.fields.some(({ path }) => this.form.get(path)?.invalid);
  }
}

// Exported for test.
export function makeControlForField(field: PageField, organization: OrganizationAccount): FormGroup | FormControl {
  switch (field.type) {
    case 'date': {
      return new FormGroup({ startDate: new FormControl(), endDate: new FormControl() });
    }
    case 'unit': {
      const defaultValue = (field.units === 'currency' && organization.currency) || DEFAULT_UNITS[field.units];
      return new FormGroup({ value: new FormControl(), unit: new FormControl(defaultValue) });
    }
    case 'expense': {
      return new FormGroup({
        description: new FormControl(field.label ?? null),
        normId: new FormControl(field.normId ?? null),
        spend: makeControlForField({ type: 'unit', units: 'currency', path: field.path + '.spend' }, organization),
      });
    }
    default: {
      return new FormControl();
    }
  }
}
