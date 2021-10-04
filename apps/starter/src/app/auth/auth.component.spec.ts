import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { Auth0ClientService } from '@auth0/auth0-angular';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { of } from 'rxjs';

import { AuthComponent } from './auth.component';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeAll(() => {
    // Auth0Client requires crypto to be present
    (window.crypto as unknown) = { subtle: {} };
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthComponent],
      providers: [
        { provide: Auth0ClientService, useValue: new Auth0Client({ domain: '', client_id: '' }) },
        { provide: ActivatedRoute, useValue: { url: of([{ path: 'login' }]) } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
