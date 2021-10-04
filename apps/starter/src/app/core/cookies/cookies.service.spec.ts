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

import { TestBed } from '@angular/core/testing';

import { Angulartics2GoogleGlobalSiteTag } from 'angulartics2';

import { firstValueFrom } from 'rxjs';

import { ALL_COOKIES_ACCEPTED, CookiesService, LOCAL_STORAGE_KEY } from './cookies.service';

describe('CookiesService', () => {
  let location: Location;
  let startTracking: jest.SpyInstance;

  beforeAll(() => {
    location = window.location;
    delete (window as unknown as { location?: Location }).location;
  });

  beforeEach(async () => {
    startTracking = jest.fn();
    (window as unknown as { location: Partial<Location> }).location = { reload: jest.fn() };

    await TestBed.configureTestingModule({
      providers: [{ provide: Angulartics2GoogleGlobalSiteTag, useValue: { startTracking } }],
    }).compileComponents();
  });

  afterEach(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    window.location = location;
  });

  const createService = (): CookiesService => TestBed.inject(CookiesService);

  it('should be created', () => {
    const service = createService();
    expect(service).toBeTruthy();
  });

  describe('accepted$', () => {
    it('should return null if the terms have not yet been accepted', async () => {
      const service = createService();

      const accepted = await firstValueFrom(service.accepted$);
      expect(accepted).toEqual(null);
    });

    it('should return the settings if the terms have been accepted', async () => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ALL_COOKIES_ACCEPTED));
      const service = createService();

      const accepted = await firstValueFrom(service.accepted$);
      expect(accepted).toEqual(ALL_COOKIES_ACCEPTED);
    });
  });

  describe('accept', () => {
    it('should store the acceptance in localStorage', () => {
      const service = createService();
      service.accept();

      const fromStorage = localStorage.getItem(LOCAL_STORAGE_KEY) || 'null';
      expect(JSON.parse(fromStorage)).toEqual(ALL_COOKIES_ACCEPTED);
    });

    it('should emit the settings value on accepted$', async () => {
      const service = createService();
      service.accept();

      const accepted = await firstValueFrom(service.accepted$);
      expect(accepted).toEqual(ALL_COOKIES_ACCEPTED);
    });

    it('should allow a subset of the settings to be set', async () => {
      const service = createService();
      service.accept({ ...ALL_COOKIES_ACCEPTED, performance: false });

      const accepted = await firstValueFrom(service.accepted$);
      expect(accepted).toHaveProperty('performance', false);
    });
  });

  describe('configure', () => {
    it('should set configuring$ to true if called with no args', async () => {
      const service = createService();
      service.configure();

      const configuring = await firstValueFrom(service.configuring$);
      expect(configuring).toEqual(true);
    });

    it('should set configuring$ to false if called with false', async () => {
      const service = createService();
      service.configure(false);

      const configuring = await firstValueFrom(service.configuring$);
      expect(configuring).toEqual(false);
    });
  });

  describe('cookies', () => {
    it('should start tracking if settings.performance has been set', () => {
      const service = createService();
      service.accept();

      expect(startTracking).toHaveBeenCalled();
    });

    it('should not start tracking if settings.performance has been set to false', () => {
      const service = createService();
      service.accept({ ...ALL_COOKIES_ACCEPTED, performance: false });

      expect(startTracking).not.toHaveBeenCalled();
    });

    it('should reload the page if acceptence terms are updated', () => {
      const service = createService();

      service.accept();
      expect(window.location.reload).not.toHaveBeenCalled();

      service.accept({ ...ALL_COOKIES_ACCEPTED, performance: false });
      expect(window.location.reload).toHaveBeenCalled();
    });
  });
});
