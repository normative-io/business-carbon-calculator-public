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
