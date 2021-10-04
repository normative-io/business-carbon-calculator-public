import { Component } from '@angular/core';
import { Routes } from '@angular/router';

@Component({ selector: 'n-mock' })
class MockComponent {}

export const MOCK_ROUTES: Routes = [
  { path: '', component: MockComponent, children: [{ path: 'dashboard', component: MockComponent }] },
  { path: 'auth', component: MockComponent },
  { path: 'onboarding', component: MockComponent },
  { path: 'wizard', component: MockComponent, children: [{ path: ':id', component: MockComponent }] },
];
