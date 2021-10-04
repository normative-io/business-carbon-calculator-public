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
import { By } from '@angular/platform-browser';

import { LottieComponent, LottieModule } from 'ngx-lottie';

import { LoadingPage } from '../wizard.types';

import { WizardLoaderComponent } from './wizard-loader.component';
import { MOCK_LOADING_PAGE, MOCK_LOTTIE_PLAYER } from './wizard-loader.mocks';

describe('WizardLoaderComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WizardLoaderComponent],
      imports: [LottieModule.forRoot({ player: () => MOCK_LOTTIE_PLAYER })],
    }).compileComponents();
  });

  const createComponent = (page: LoadingPage = MOCK_LOADING_PAGE): ComponentFixture<WizardLoaderComponent> => {
    const fixture = TestBed.createComponent(WizardLoaderComponent);
    fixture.componentInstance.page = page;
    fixture.detectChanges();
    return fixture;
  };

  it('should create', () => {
    const { componentInstance: component } = createComponent();
    expect(component).toBeTruthy();
  });

  it('should set the animation path from the page config', () => {
    const { debugElement } = createComponent();
    const lottie = debugElement.query(By.directive(LottieComponent));
    expect(lottie.componentInstance).toHaveProperty('options', { path: '/test.json' });
  });

  it('should set the dimensions of the animation from the page config', () => {
    const { debugElement } = createComponent();
    const lottie = debugElement.query(By.directive(LottieComponent));
    expect(lottie.componentInstance).toHaveProperty('height', '50px');
    expect(lottie.componentInstance).toHaveProperty('width', '50px');
  });

  it('should render the text labels from the page config', () => {
    const { debugElement } = createComponent();
    const labels = debugElement.queryAll(By.css('.label'));
    expect(labels).toHaveLength(2);
    expect(labels[0].nativeElement.innerHTML).toContain('Label 1');
    expect(labels[1].nativeElement.innerHTML).toContain('Label 2');
  });
});
