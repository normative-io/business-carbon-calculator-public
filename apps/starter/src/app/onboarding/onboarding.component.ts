import { AnimationEvent } from '@angular/animations';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormControlStatus,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';

import { Select, Store } from '@ngxs/store';

import { BehaviorSubject, combineLatest, merge, Observable, Subscription } from 'rxjs';
import { delay, filter, map, mergeMap, switchMap, take } from 'rxjs/operators';

import { FetchCountries, FetchSectors } from '../core/data/data.actions';
import { Country, Sector } from '../core/data/data.model';
import { DataState } from '../core/data/data.state';
import { LoggingService } from '../core/logging/logging.service';
import { ONBOARDING_LOGGING_CATEGORY, PAGE_TIMING_LOGGING_CATEGORY } from '../core/logging/logging.utils';
import { CreateOrganization } from '../core/organization/organization.actions';
import { CreateOrganizationAccountRequest, OrganizationAccount } from '../core/organization/organization.model';
import { OrganizationState } from '../core/organization/organization.state';
import { AcceptTerms } from '../core/user/user.actions';
import { OrganizationAccountSnapshot } from '../core/user/user.model';
import { UserState } from '../core/user/user.state';
import { isNonNullable } from '../core/utils/rxjs.utils';

import { AnimationDirection, slideAnimation } from './onboarding.animations';
import { LOADING_PAGE_ID, ONBOARDING_PAGES, TERMS_ONLY_ONBOARDING_PAGES, TERMS_PAGE_ID } from './onboarding.config';
import { NameAndValue, OnboardingPage } from './onboarding.types';

const IS_VALID: FormControlStatus = 'VALID';
const IS_VALID$ = new BehaviorSubject<FormControlStatus>(IS_VALID);
const SHOW_LOADER_FOR_AT_LEAST = 3000;

type OnboardingFormValue = CreateOrganizationAccountRequest & { terms: boolean };

class OnboardingErrorStateMatcher implements ErrorStateMatcher {
  /** Only show errors once the control has been touched. */
  isErrorState(control: FormControl | null): boolean {
    return !!control && control.invalid && control.touched;
  }
}

@Component({
  selector: 'n-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
  animations: [slideAnimation],
})
export class OnboardingComponent implements OnDestroy, OnInit {
  @Input() onboardingPages: OnboardingPage[] = ONBOARDING_PAGES;
  @Input() termsOnlyOnboardingPages: OnboardingPage[] = TERMS_ONLY_ONBOARDING_PAGES;

  /** The page to start the user on (if not the first). */
  @Input() page?: OnboardingPage;

  pages: OnboardingPage[] = [];

  @Select(UserState.acceptedTerms) private acceptedTerms$!: Observable<boolean | true>;
  @Select(DataState.countries) private countries$!: Observable<Country[]>;
  @Select(OrganizationState.organization) private organization$!: Observable<OrganizationAccount | null>;
  @Select(UserState.organization) private organizationSnapshot$!: Observable<OrganizationAccountSnapshot | null>;
  @Select(DataState.sectors) private sectors$!: Observable<Sector[]>;

  /** The currently visible input field. */
  @ViewChild('input') input!: ElementRef<HTMLInputElement> | MatSelect;

  /** The countries supported by the application. */
  countriesOptions$ = this.countries$.pipe(map(mapCountriesToNameAndValue));

  /** The sectors supported by the application. */
  sectorsOptions$ = this.sectors$.pipe(map(mapSectorsToNameAndValue));

  /** The reactive form to bind the UI to. */
  form = new FormGroup({
    terms: new FormControl(null, Validators.requiredTrue),
    name: new FormControl(null, requiredText),
    vat: new FormControl(null, requiredText),
    country: new FormControl(null, Validators.required),
    sector: new FormControl(null, requiredSector),
  });

  /**
   * The nth position (0-indexed) of the current modal page the user is on
   * (relative to {@link OnboardingComponent#pages}).
   */
  index$ = new BehaviorSubject(0);

  /** The current page the user is on.*/
  page$: Observable<OnboardingPage | undefined> = this.index$.pipe(map((index) => this.pages[index]));

  /** */
  termsOnly$!: Observable<boolean>;

  /** Determines whether the current step contains valid input. */
  valid$ = this.page$.pipe(
    filter(isNonNullable),
    map(({ field, id }) => (id === TERMS_PAGE_ID ? this.form.get(id) : field ? this.form.get(field.path) : null)),
    switchMap((control) => (control ? merge(new BehaviorSubject(control.status), control.statusChanges) : IS_VALID$)),
    map((status) => status === IS_VALID)
  );

  /** The animation direction when a page is rendered. */
  direction = AnimationDirection.NONE;

  /** Subscriptions created within the component that need to be unsubscribed on destroy. */
  subscriptions: Subscription[] = [];

  private pageViewStartTime = 0;

  // For template
  readonly AnimationDirection = AnimationDirection;
  readonly errorStateMatcher = new OnboardingErrorStateMatcher();

  constructor(private router: Router, private store: Store, private loggingService: LoggingService) {}

  ngOnInit() {
    this.pageViewStartTime = Math.round(Date.now());

    // Load data
    this.store.dispatch([new FetchCountries(), new FetchSectors()]);

    // Determine pages to show based on requirements
    // (users already with organizations only need to re-accept terms rather that go through the whole flow)
    this.termsOnly$ = combineLatest([this.organizationSnapshot$, this.acceptedTerms$]).pipe(
      map(([organizationSnapshot, acceptedTerms]) => Boolean(organizationSnapshot && !acceptedTerms)),
      take(1)
    );

    const initSubscription = this.termsOnly$.subscribe((termsOnly) => {
      this.pages = termsOnly ? this.termsOnlyOnboardingPages : this.onboardingPages;
    });

    this.subscriptions.push(initSubscription);

    // Submit form on viewing final page
    const submitSubscription = this.page$
      .pipe(
        filter(isNonNullable),
        filter((page) => this.isFinalLoadingPage(page)),
        take(1),
        mergeMap(() => combineLatest([this.termsOnly$, this.countries$]))
      )
      .subscribe(([termsOnly, countries]) => this.submit(this.form.value, termsOnly, countries));

    this.subscriptions.push(submitSubscription);

    // Redirect user on completing final page
    const redirectSubscription = this.index$
      .pipe(
        map((index) => index === this.pages.length - 1),
        filter(Boolean),
        take(1),
        delay(SHOW_LOADER_FOR_AT_LEAST)
      )
      .subscribe(() => this.redirect());

    this.subscriptions.push(redirectSubscription);

    // Start
    const start = this.page && findPage(this.pages, this.page);
    this.index$.next(start ? this.pages.indexOf(start) : 0);
  }

  ngOnDestroy() {
    for (const subscription of this.subscriptions) {
      subscription.unsubscribe();
    }
  }

  // Navigation

  /** Goes to the next page. */
  next() {
    this.trackNavigationEventWithTiming('OnboardingNextClick');
    const current = this.index$.value;
    const next = current + 1;

    this.direction = AnimationDirection.NEXT;
    this.index$.next(next);
  }

  /** Goes to the previous page. */
  previous() {
    this.trackNavigationEventWithTiming('OnboardingPreviousClick');
    const current = this.index$.value;
    const previous = current - 1;

    this.direction = AnimationDirection.PREVIOUS;
    this.index$.next(previous);
  }

  private trackNavigationEventWithTiming(eventName: string) {
    this.page$?.pipe(take(1)).subscribe((page) => {
      if (page) {
        // Log the time spent on this page before navigation.
        const timeSincePageViewStart = Math.round(Date.now()) - this.pageViewStartTime;
        this.loggingService.logEvent(`${page.id}OnboardingPageView`, {
          category: PAGE_TIMING_LOGGING_CATEGORY,
          value: timeSincePageViewStart,
        });
        this.pageViewStartTime = Math.round(Date.now());
      }

      // Log navigation event.
      this.loggingService.logEvent(eventName, { category: ONBOARDING_LOGGING_CATEGORY, label: page?.id });
    });
  }

  /** Redirects to the required path once the oganization is present. */
  private redirect() {
    const subscription = this.organization$
      .pipe(filter(isNonNullable), take(1))
      .subscribe(() => this.router.navigateByUrl('/wizard'));

    this.subscriptions.push(subscription);
  }

  /** Creates a new organization. */
  private submit({ terms, ...organization }: OnboardingFormValue, termsOnly: boolean, countries: Country[]) {
    this.form.markAsPristine();

    const actions: (AcceptTerms | CreateOrganization)[] = [new AcceptTerms(terms)];

    if (!termsOnly) {
      const currency = countries.find(({ iso2 }) => iso2 === organization.country)?.currency;
      const payload = currency ? { ...organization, currency } : organization;
      actions.push(new CreateOrganization(payload));
    }

    return this.store.dispatch(actions);
  }

  // Template helpers

  /** Focuses the current input field on starting the animation. */
  animationStart(event: AnimationEvent) {
    if (event.fromState === 'void' && this.input) {
      if (this.input instanceof MatSelect) this.input.focus();
      else this.input.nativeElement.focus();
    }
  }

  boldify(text: string) {
    // Quick hack for styling -- we ought to refactor the existing implementation in wizard/
    return text.replace(/\*\*(.*?)\*\*/gm, '<strong>$1</strong>');
  }

  isFinalLoadingPage(page: OnboardingPage): boolean {
    return page.id === LOADING_PAGE_ID;
  }

  getDisplayTotalPages() {
    return this.pages.length - 1;
  }

  getDisplayIndex(displayIndex: number) {
    return Math.min(displayIndex, this.getDisplayTotalPages());
  }
}

function findPage(pages: OnboardingPage[], page: OnboardingPage): OnboardingPage | undefined {
  return pages.find(({ id }) => id === page.id);
}

function mapCountriesToNameAndValue(countries: Country[]): NameAndValue[] {
  return countries.map(({ name, iso2 }) => ({ name, value: iso2 }));
}

function mapSectorsToNameAndValue(sectors: Sector[]): NameAndValue[] {
  return sectors.map(({ name, nace }) => ({ name, value: nace }));
}

/** Validator to allow empty strings (aka "Not Listed" sector), but not other nullables. */
function requiredSector(control: AbstractControl): ValidationErrors | null {
  return isNonNullable(control.value) ? null : { required: true };
}

/** Validator to ensure required control has had text added (excluding spaces). */
function requiredText(control: AbstractControl): ValidationErrors | null {
  return !control.value || !control.value.trim().length ? { required: true } : null;
}
