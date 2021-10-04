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

import { formatCurrency, formatNumber, parseNumber } from './number.utils';

describe('formatCurrency', () => {
  it("should return the number based on the user's default locale", () => {
    expect(formatCurrency(1234.56, 'USD')).toEqual('$1,234.56');
    expect(formatCurrency(1234567.8901, 'USD')).toEqual('$1,234,567.89');
  });

  it('should not return decimals if the number is an integer', () => {
    expect(formatCurrency(1234, 'USD')).toEqual('$1,234');
  });

  it('should return the same format without a unit if the currency param is not set', () => {
    expect(formatCurrency(1234567.8901)).toEqual('1,234,567.89');
  });

  it('should allow extra options to be passed to the formatter', () => {
    expect(formatCurrency(1234567.89, 'USD', { maximumSignificantDigits: 3 })).toEqual('$1,230,000');
  });

  it('should return an empty string if the value is not a number', () => {
    expect(formatCurrency(null, 'USD')).toEqual('');
    expect(formatCurrency(undefined, 'USD')).toEqual('');
  });
});

describe('formatNumber', () => {
  it("should return the number based on the user's default locale", () => {
    expect(formatNumber(1234)).toEqual('1,234');
    expect(formatNumber(1234567.89)).toEqual('1,234,567.89');
  });

  it('should allow extra options to be passed to the formatter', () => {
    expect(formatNumber(1234567.89, { maximumSignificantDigits: 3 })).toEqual('1,230,000');
  });

  it('should return an empty string if the value is not a number', () => {
    expect(formatNumber(null)).toEqual('');
    expect(formatNumber()).toEqual('');
  });
});

describe('parseValue', () => {
  it('should return the number value of a string', () => {
    expect(parseNumber('123.456')).toEqual(123.456);
  });

  it('should return null if the value was not a number', () => {
    expect(parseNumber('not a number')).toEqual(null);
  });

  it('should ignore any non-numeric characters (other than the decimal separator)', () => {
    expect(parseNumber('123,456.789')).toEqual(123456.789);
    expect(parseNumber('abc123456.789')).toEqual(123456.789);
    expect(parseNumber('12a34b56.c789')).toEqual(123456.789);
  });
});
