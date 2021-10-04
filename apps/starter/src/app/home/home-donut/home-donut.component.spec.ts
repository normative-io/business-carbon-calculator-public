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
import { MatTooltipModule } from '@angular/material/tooltip';
import { By } from '@angular/platform-browser';

import { MockIconsModule } from '../../core/icons/icons.mocks';
import { MOCK_IMPACT, MOCK_IMPACT_FUEL } from '../../core/impact/impact.mocks';
import { Impact } from '../../core/impact/impact.model';
import { CoverageStatus } from '../../core/utils/coverage.utils';
import {
  MOCK_HIGH_COVERAGE_WIZARD_ENTRY_RESPONSE,
  MOCK_MIXED_CURRENCY_WIZARD_ENTRY_RESPONSE,
  MOCK_MEDIUM_COVERAGE_WIZARD_ENTRY_RESPONSE,
  MOCK_LOW_COVERAGE_WIZARD_ENTRY_RESPONSE,
  MOCK_WIZARD_ENTRY_RESPONSE,
} from '../../wizard/ngxs/wizard.mocks';
import { WizardEntryResponse } from '../../wizard/ngxs/wizard.model';
import { TonnesModule } from '../tonnes/tonnes.module';

import { HomeDonutComponent } from './home-donut.component';

jest.mock('../../core/utils/coverage.utils', () => ({
  ...jest.requireActual('../../core/utils/coverage.utils'),
  getCoverageStatusWording: jest.fn((status) => status), // mocking so we can test status, not final wording
}));

describe('HomeDonutComponent', () => {
  let component: HomeDonutComponent;
  let fixture: ComponentFixture<HomeDonutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeDonutComponent],
      imports: [MockIconsModule, MatTooltipModule, TonnesModule],
    }).compileComponents();
  });

  const createComponent = (impact: Impact | null, showImpact = true, entry?: WizardEntryResponse): void => {
    fixture = TestBed.createComponent(HomeDonutComponent);
    component = fixture.componentInstance;

    component.impact = impact;
    component.showImpact = showImpact;

    if (entry) {
      component.entry = entry;
    }

    component.ngOnChanges();
    fixture.detectChanges();
  };

  it('should create', () => {
    createComponent(MOCK_IMPACT);
    expect(component).toBeTruthy();
  });

  it('should highlight segment and scope block on hover', () => {
    createComponent(MOCK_IMPACT);

    const pathEl = fixture.nativeElement.querySelector('path');
    const scopeBlockEl = fixture.debugElement.query(By.css('#scope-1'));
    expect(pathEl.getAttribute('fill')).toEqual('var(--scope-1-color)');
    expect(scopeBlockEl.classes.highlight).toBeFalsy();

    pathEl.dispatchEvent(new Event('mouseover', {}));
    fixture.detectChanges();

    expect(pathEl.getAttribute('fill')).toEqual('var(--highlight-color)');
    expect(scopeBlockEl.classes.highlight).toBeTruthy();
  });

  it('should unhighlight after hover', () => {
    createComponent(MOCK_IMPACT);

    const pathEl = fixture.nativeElement.querySelector('path');
    const scopeBlockEl = fixture.debugElement.query(By.css('#scope-1'));

    pathEl.dispatchEvent(new Event('mouseover', {}));
    fixture.detectChanges();

    expect(pathEl.getAttribute('fill')).toEqual('var(--highlight-color)');
    expect(scopeBlockEl.classes.highlight).toBeTruthy();

    pathEl.dispatchEvent(new Event('mouseout', {}));
    fixture.detectChanges();

    expect(pathEl.getAttribute('fill')).toEqual('var(--scope-1-color)');
    expect(scopeBlockEl.classes.highlight).toBeFalsy();
  });

  it('should show tooltip on hover', () => {
    createComponent(MOCK_IMPACT);

    expect(component.showTooltip).toBeFalsy();

    const pathEl = fixture.nativeElement.querySelector('path');
    pathEl.dispatchEvent(new Event('mouseover', {}));
    fixture.detectChanges();

    expect(component.showTooltip).toBeTruthy();
    expect(component.hoverCategory).toEqual('Category 1');
    expect(component.hoverValue).toEqual(500000);
    expect(fixture.debugElement.query(By.css('.tooltip'))).toBeTruthy();
  });

  it('should replace tooltip name for Fuel combustion on hover', () => {
    createComponent(MOCK_IMPACT_FUEL);

    expect(component.showTooltip).toBeFalsy();

    const pathEl = fixture.nativeElement.querySelector('path');
    pathEl.dispatchEvent(new Event('mouseover', {}));
    fixture.detectChanges();

    expect(component.showTooltip).toBeTruthy();
    expect(component.hoverCategory).toEqual('Fuel combustion');
    expect(component.hoverValue).toEqual(500000);
    expect(fixture.debugElement.query(By.css('.tooltip'))).toBeTruthy();
  });

  it('should hide donut view when rendering in progress view', () => {
    createComponent(null, false);

    expect(fixture.debugElement.query(By.css('.body--placeholder'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.prompt'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.legend--hidden'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.tooltip--hidden'))).toBeTruthy();
  });

  it('should hide in progress view when rendering donut view', () => {
    createComponent(MOCK_IMPACT);

    expect(fixture.debugElement.query(By.css('.body'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.prompt--hidden'))).toBeTruthy();
    expect(fixture.debugElement.query(By.css('.legend'))).toBeTruthy();
  });

  it('should show high coverage when a total expense and most expenses entered', () => {
    createComponent(MOCK_IMPACT, true, MOCK_HIGH_COVERAGE_WIZARD_ENTRY_RESPONSE);

    expect(fixture.debugElement.query(By.css('.coverage'))).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.coverage .coverage__status').innerHTML).toEqual(CoverageStatus.HIGH);
  });

  it('should show low coverage when a total expense and few or no expenses entered', () => {
    createComponent(MOCK_IMPACT, true, MOCK_LOW_COVERAGE_WIZARD_ENTRY_RESPONSE);

    expect(fixture.debugElement.query(By.css('.coverage'))).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.coverage .coverage__status').innerHTML).toEqual(CoverageStatus.LOW);
  });

  it('should show medium coverage when a total expense and some expenses entered', () => {
    createComponent(MOCK_IMPACT, true, MOCK_MEDIUM_COVERAGE_WIZARD_ENTRY_RESPONSE);

    expect(fixture.debugElement.query(By.css('.coverage'))).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.coverage .coverage__status').innerHTML).toEqual(CoverageStatus.MEDIUM);
  });

  it('should show a coverage warning when no spend data had been entered', () => {
    createComponent(MOCK_IMPACT, true, MOCK_WIZARD_ENTRY_RESPONSE);

    expect(fixture.nativeElement.querySelector('.coverage .coverage__status').innerHTML).toEqual(
      CoverageStatus.ERROR_NO_SPEND
    );
  });

  it('should show a coverage warning when multiple currencies had been entered', () => {
    createComponent(MOCK_IMPACT, true, MOCK_MIXED_CURRENCY_WIZARD_ENTRY_RESPONSE);

    expect(fixture.nativeElement.querySelector('.coverage .coverage__status').innerHTML).toEqual(
      CoverageStatus.ERROR_MULTIPLE_CURRENCIES
    );
  });
});
