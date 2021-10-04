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
