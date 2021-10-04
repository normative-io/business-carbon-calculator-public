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

import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { TonnesService } from './tonnes.service';

describe('TonnesService', () => {
  let service: TonnesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: LOCALE_ID, useValue: 'se' }],
    });
    service = TestBed.inject(TonnesService);
  });

  const NBSP_REGEX = new RegExp(String.fromCharCode(160), 'g');
  const nbspToSpace = (value: string): string => value.replace(NBSP_REGEX, ' ');

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('toTonnes', () => {
    it('shout convert a kg CO2e value to t CO2e', () => {
      expect(service.toTonnes(123)).toEqual(0.123);
      expect(service.toTonnes(123456)).toEqual(123.456);
    });
  });

  describe('format', () => {
    it('should format numbers to 3 values detail', () => {
      expect(nbspToSpace(service.format(0.1234))).toEqual('0.123');
      expect(nbspToSpace(service.format(123))).toEqual('123');
      expect(nbspToSpace(service.format(1234))).toEqual('1,230');
      expect(nbspToSpace(service.format(12345))).toEqual('12,300');
      expect(nbspToSpace(service.format(123456))).toEqual('123,000');
      expect(nbspToSpace(service.format(1234567))).toEqual('1,230,000');
    });
  });
});
