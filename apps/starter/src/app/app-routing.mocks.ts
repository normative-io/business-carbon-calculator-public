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
