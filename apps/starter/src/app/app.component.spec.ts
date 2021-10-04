import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { CookiesModule } from './core/cookies/cookies.module';
import { CookiesService } from './core/cookies/cookies.service';
import { LoggingService } from './core/logging/logging.service';
import { UserService } from './core/user/user.service';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule, CookiesModule],
      providers: [
        { provide: CookiesService, useValue: { accepted$: of(false) } },
        { provide: UserService, useValue: {} },
        { provide: LoggingService, useValue: {} },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
