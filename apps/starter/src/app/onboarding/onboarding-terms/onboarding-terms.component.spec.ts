import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnboardingTermsComponent } from './onboarding-terms.component';

describe('OnboardingTermsComponent', () => {
  let component: OnboardingTermsComponent;
  let fixture: ComponentFixture<OnboardingTermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OnboardingTermsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
