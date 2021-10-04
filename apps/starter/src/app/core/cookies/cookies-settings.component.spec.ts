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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';

import { MockLoggingService } from '../logging/logging.mocks';
import { LoggingService } from '../logging/logging.service';

import { CookiesSettingsComponent } from './cookies-settings.component';
import { MockCookiesService } from './cookies.mocks';
import { ALL_COOKIES_ACCEPTED, CookiesService } from './cookies.service';

describe('CookiesSettingsComponent', () => {
  let component: CookiesSettingsComponent;
  let fixture: ComponentFixture<CookiesSettingsComponent>;
  let service: MockCookiesService;
  let loggingService: MockLoggingService;

  beforeEach(async () => {
    service = new MockCookiesService();
    loggingService = new MockLoggingService();

    await TestBed.configureTestingModule({
      declarations: [CookiesSettingsComponent],
      imports: [MatCheckboxModule, MatDialogModule, ReactiveFormsModule],
      providers: [
        { provide: CookiesService, useValue: service },
        { provide: LoggingService, useValue: loggingService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CookiesSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should populate the form with the previously accepted settings', () => {
    const settings = { ...ALL_COOKIES_ACCEPTED, performance: false };
    service.accepted$.next(settings);

    expect(component.form.getRawValue()).toEqual(settings);
  });

  it('should call accept with the correct settings on submit', () => {
    const performance = fixture.debugElement.query(By.css('label[for="performance-input"]'));
    performance.nativeElement.click();

    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    button.nativeElement.click();

    expect(service.accept).toHaveBeenCalledWith({
      necessary: true,
      performance: true,
      functional: false,
      targeting: false,
    });
  });
});
