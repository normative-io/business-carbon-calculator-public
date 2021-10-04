import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockIconsModule } from '../../core/icons/icons.mocks';
import { MockLoggingService } from '../../core/logging/logging.mocks';
import { LoggingService } from '../../core/logging/logging.service';
import { DASHBOARD_LOGGING_CATEGORY } from '../../core/logging/logging.utils';
import { MOCK_ORGANIZATION_ACCOUNT } from '../../core/organization/organization.mocks';

import { HomeActionsComponent } from './home-actions.component';

describe('HomeActionsComponent', () => {
  let component: HomeActionsComponent;
  let fixture: ComponentFixture<HomeActionsComponent>;
  let loggingService: MockLoggingService;

  beforeEach(async () => {
    loggingService = new MockLoggingService();

    await TestBed.configureTestingModule({
      declarations: [HomeActionsComponent],
      imports: [MockIconsModule],
      providers: [{ provide: LoggingService, useValue: loggingService }],
    }).compileComponents();
  });

  const createComponent = (): void => {
    fixture = TestBed.createComponent(HomeActionsComponent);
    component = fixture.componentInstance;
    component.organization = MOCK_ORGANIZATION_ACCOUNT;

    fixture.detectChanges();
  };

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should log click before navigating to SMECH tips', () => {
    createComponent();

    const link = fixture.nativeElement.querySelector('.text a');
    link.click();

    expect(loggingService.logEvent).toHaveBeenCalledWith('SeeTipsButtonClick', {
      category: DASHBOARD_LOGGING_CATEGORY,
    });
  });

  it('should log click before navigating to Benchmark page', () => {
    createComponent();

    const link = fixture.nativeElement.querySelector('.insights a');
    link.click();

    expect(fixture.componentInstance.getBenchmarkUrl()).toEqual('https://benchmark.normative.io?region=SE&bccnace=61');
    expect(loggingService.logEvent).toHaveBeenCalledWith('BenchmarkButtonClick', {
      category: DASHBOARD_LOGGING_CATEGORY,
    });
  });
});
