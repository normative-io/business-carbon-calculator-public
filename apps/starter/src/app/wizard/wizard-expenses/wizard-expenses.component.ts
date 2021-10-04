import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { CoverageStatus, getCoverageStatusFromEntry, getCoverageStatusWording } from '../../core/utils/coverage.utils';
import { formatCurrency } from '../../core/utils/number.utils';
import { ValueWithUnit, WizardEntry } from '../ngxs/wizard.model';
import { ExpenseCategory, ExpenseField, UnitField } from '../wizard.types';

interface Amount {
  currency: string;
  total: number;
}

interface Coverage {
  declared?: Amount;
  status: string;
  tooltip: string;
  total?: Amount;
}

type Total = Amount[];

@Component({
  selector: 'n-wizard-expenses',
  templateUrl: './wizard-expenses.component.html',
  styleUrls: ['./wizard-expenses.component.scss'],
})
export class WizardExpensesComponent implements OnInit {
  @Input() categories!: ExpenseCategory[];
  @Input() form!: FormGroup;

  @Output() saveOnFocusOut = new EventEmitter();

  coverage$?: Observable<Coverage>;
  total$?: Observable<Total>;
  totals$?: Observable<Total[]>;

  constructor(private host: ElementRef) {}

  ngOnInit() {
    // On form changing, recalculate the totals
    const formValue = startWith<WizardEntry, [WizardEntry]>(this.form.value);
    this.totals$ = this.form.valueChanges.pipe(
      formValue,
      map(() => this.getTotals())
    );

    // On totals changing, recalculate the overall total
    this.total$ = this.totals$.pipe(map((totals) => this.getTotal(totals)));

    // On total changing, recalculate the expenses coverage
    this.coverage$ = combineLatest([this.form.valueChanges.pipe(formValue), this.total$]).pipe(
      map(([entry, total]) => this.getCoverage(entry, total))
    );
  }

  getUnitField(subcategory: ExpenseField): UnitField {
    return {
      ...subcategory,
      path: `${subcategory.path}.spend`,
      placeholder: '0',
      type: 'unit',
      units: 'currency',
    };
  }

  formatAmount(amount: Amount) {
    return formatCurrency(amount.total, amount.currency);
  }

  private getCoverage(entry: WizardEntry, total: Total): Coverage {
    const declared = entry.spend?.value || 0;
    const status = getCoverageStatusFromEntry(entry);
    const coverage = { status: getCoverageStatusWording(status), tooltip: this.getTooltipText(status) };

    return status !== CoverageStatus.ERROR_MULTIPLE_CURRENCIES && status !== CoverageStatus.ERROR_NO_SPEND
      ? { ...coverage, declared: { total: declared, currency: entry.spend?.unit || '' }, total: total[0] }
      : coverage;
  }

  private getTooltipText(coverage: CoverageStatus): string {
    switch (coverage) {
      case CoverageStatus.ERROR_MULTIPLE_CURRENCIES:
        return 'We are currently unable to compute your expense coverage as you have entered expenses in more than one currency. If possible, enter expenses using the same currency.';
      case CoverageStatus.ERROR_NO_SPEND:
        return 'We are unable to compute your expense coverage because you did not enter your total expenses. Please go to the previous screen and enter your total expenses, and then return to see your current expense coverage.';
      default:
        return 'For a more complete carbon estimate, try to match at least 80% of your total expenses to specific expense categories if possible.';
    }
  }

  private getTotal(totals: Total[]): Total {
    const amounts = totals.reduce(
      (all, categoryTotal) => [...all, ...categoryTotal.filter(({ total }) => total > 0)],
      []
    );

    return amounts.length
      ? amounts.reduce<Total>((all, amount) => {
          const prev = all.find(({ currency }) => currency === amount.currency);
          return prev
            ? all.map((current) => (current === prev ? { ...prev, total: prev.total + amount.total } : current))
            : [...all, amount];
        }, [])
      : getZeroTotal(this.categories[0], this.form);
  }

  private getTotals(): Total[] {
    return this.categories.map((category) => {
      // Get totals for each currency
      const totals = category.subcategories.reduce<{ [key: string]: number }>((cumulative, field) => {
        const valueWithUnit: ValueWithUnit | null = getExpenseSpend(field, this.form);
        return valueWithUnit && valueWithUnit.value
          ? { ...cumulative, [valueWithUnit.unit]: (cumulative[valueWithUnit.unit] || 0) + valueWithUnit.value }
          : cumulative;
      }, {});

      // Convert to amounts (useful for decimal pipe)
      const entries = Object.entries(totals);
      return entries.length
        ? entries.map<Amount>(([currency, total]) => ({ currency, total }))
        : getZeroTotal(category, this.form);
    });
  }

  scrollToTop() {
    // TODO: Scroll to top for all wizard routes
    let scrolled: HTMLElement | null = this.host.nativeElement;
    while (scrolled && scrolled.scrollTop === 0) {
      scrolled = scrolled.parentElement;
    }

    if (scrolled) {
      scrolled.scrollTop = 0;
    }
  }
}

function getExpenseSpend(field: ExpenseField, form: FormGroup): ValueWithUnit | null {
  return form.get(field.path)?.get('spend')?.value;
}

function getZeroTotal(category: ExpenseCategory, form: FormGroup): Total {
  const spend = category.subcategories[0] && getExpenseSpend(category.subcategories[0], form);
  const currency = spend?.unit || '';
  return [{ currency, total: 0 }];
}
