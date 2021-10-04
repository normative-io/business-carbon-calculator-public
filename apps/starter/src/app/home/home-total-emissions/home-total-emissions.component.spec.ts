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

import { LOCALE_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockIconsModule } from '../../core/icons/icons.mocks';
import { MOCK_IMPACT } from '../../core/impact/impact.mocks';
import { Impact } from '../../core/impact/impact.model';
import { MockLoggingService } from '../../core/logging/logging.mocks';
import { LoggingService } from '../../core/logging/logging.service';
import { DASHBOARD_LOGGING_CATEGORY } from '../../core/logging/logging.utils';
import { MOCK_WIZARD_ENTRY } from '../../wizard/ngxs/wizard.mocks';
import { WizardEntry } from '../../wizard/ngxs/wizard.model';
import { TonnesModule } from '../tonnes/tonnes.module';

import { HomeTotalEmissionsComponent } from './home-total-emissions.component';

describe('HomeTotalEmissionsComponent', () => {
  let loggingService: MockLoggingService;

  beforeEach(async () => {
    loggingService = new MockLoggingService();

    await TestBed.configureTestingModule({
      declarations: [HomeTotalEmissionsComponent],
      imports: [MockIconsModule, TonnesModule, RouterTestingModule],
      providers: [
        { provide: LOCALE_ID, useValue: 'se' },
        { provide: LoggingService, useValue: loggingService },
      ],
    }).compileComponents();
  });

  const createComponent = (impact: Impact, entry?: WizardEntry): ComponentFixture<HomeTotalEmissionsComponent> => {
    const fixture = TestBed.createComponent(HomeTotalEmissionsComponent);
    const component = fixture.componentInstance;

    component.entry = entry;
    component.impact = impact;
    fixture.detectChanges();

    return fixture;
  };

  it('should create', () => {
    const { componentInstance: component } = createComponent(MOCK_IMPACT);
    expect(component).toBeTruthy();
  });

  it('should format the numbers as per the locale', () => {
    const fixture = createComponent(MOCK_IMPACT);
    const headline = fixture.nativeElement.querySelector('.headline');
    expect(headline.innerHTML).toContain('2,500');
  });

  it('should show the demo cta if number of employess is above 50', () => {
    const fixture = createComponent(MOCK_IMPACT, { ...MOCK_WIZARD_ENTRY, numberOfEmployees: 50 });
    expect(fixture.nativeElement.querySelector('.accuracy__demo')).toBeNull();

    fixture.componentInstance.entry = { ...MOCK_WIZARD_ENTRY, numberOfEmployees: 51 };
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.accuracy__demo')).toBeTruthy();
  });

  it('should log clicks on the accuracy link', () => {
    const fixture = createComponent(MOCK_IMPACT);
    const link = fixture.nativeElement.querySelector('.accuracy__link');
    link.click();

    expect(loggingService.logEvent).toHaveBeenCalledWith('ImproveAccuracyButtonClick', {
      category: DASHBOARD_LOGGING_CATEGORY,
    });
  });

  it('should log clicks on the demo link', () => {
    const fixture = createComponent(MOCK_IMPACT, { ...MOCK_WIZARD_ENTRY, numberOfEmployees: 51 });
    const demo = fixture.nativeElement.querySelector('.accuracy__demo');
    demo.click();

    expect(loggingService.logEvent).toHaveBeenCalledWith('BookDemoClick', { category: DASHBOARD_LOGGING_CATEGORY });
  });
});
