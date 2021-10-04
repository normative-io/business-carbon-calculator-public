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
import { RouterTestingModule } from '@angular/router/testing';

import { Angulartics2Module } from 'angulartics2';

import { MOCK_ROUTES } from '../../app-routing.mocks';

import { MockCookiesService } from '../../core/cookies/cookies.mocks';
import { CookiesService } from '../../core/cookies/cookies.service';

import { HomeFooterComponent } from './home-footer.component';

describe('HomeFooterComponent', () => {
  let component: HomeFooterComponent;
  let fixture: ComponentFixture<HomeFooterComponent>;
  let service: MockCookiesService;

  beforeEach(async () => {
    service = new MockCookiesService();

    await TestBed.configureTestingModule({
      declarations: [HomeFooterComponent],
      imports: [Angulartics2Module.forRoot(), RouterTestingModule.withRoutes(MOCK_ROUTES)],
      providers: [{ provide: CookiesService, useValue: service }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render privacy policy and cookie consent links', () => {
    const copyright = fixture.nativeElement.querySelector('.copyright');
    const privacy = fixture.nativeElement.querySelector('.link--privacy');
    const cookies = fixture.nativeElement.querySelector('.link--cookies');

    expect(copyright).toBeTruthy();
    expect(privacy).toBeTruthy();
    expect(cookies).toBeTruthy();
  });

  it('should open cookie settings on click of cookie consent link', () => {
    const cookies = fixture.nativeElement.querySelector('.link--cookies');
    cookies.click();

    expect(service.configure).toHaveBeenCalled();
  });
});
