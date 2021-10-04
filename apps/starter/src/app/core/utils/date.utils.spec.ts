import { DateTime } from 'luxon';

import { TimePeriod } from '../../wizard/ngxs/wizard.model';

import { formatTimePeriod, getDateTime, LUXON_DATE_FORMAT_SHORT } from './dates.utils';

const WINTER: TimePeriod = { startDate: '2021-12-21T00:00:00.000Z', endDate: '2022-03-20T00:00:00.000Z' };
const SUMMER: TimePeriod = { startDate: '2022-06-21T00:00:00.000Z', endDate: '2022-09-23T00:00:00.000Z' };

const INVALID_DATE = '2022-22-22T00:00:00.000Z';

describe('formatTimePeriod', () => {
  it('should format the time period', () => {
    expect(formatTimePeriod(WINTER)).toEqual('21 December 2021 - 20 March 2022');
    expect(formatTimePeriod(SUMMER)).toEqual('21 June 2022 - 23 September 2022');
  });

  it('should separate the dates with the joiner text if provided', () => {
    expect(formatTimePeriod(WINTER, 'to')).toEqual('21 December 2021 to 20 March 2022');
    expect(formatTimePeriod(SUMMER, 'to')).toEqual('21 June 2022 to 23 September 2022');
  });

  it('should use an alternative formatting if one is provided', () => {
    expect(formatTimePeriod(WINTER, '-', LUXON_DATE_FORMAT_SHORT)).toEqual('21 Dec 2021 - 20 Mar 2022');
    expect(formatTimePeriod(SUMMER, '-', LUXON_DATE_FORMAT_SHORT)).toEqual('21 Jun 2022 - 23 Sep 2022');
  });

  it('should return an empty string if the time period contains invalid dates', () => {
    expect(formatTimePeriod({ startDate: '', endDate: '' })).toEqual('');
    expect(formatTimePeriod({ startDate: INVALID_DATE, endDate: INVALID_DATE })).toEqual('');
  });
});

describe('getDateTime', () => {
  it('should return the value if already a DateTime', () => {
    const value = DateTime.fromISO(WINTER.startDate, { zone: 'utc' });
    expect(getDateTime(value)).toEqual(value);
  });

  it('should return a new DateTime if the value is a string', () => {
    const result = getDateTime(WINTER.startDate);
    expect(result.toISO()).toEqual(WINTER.startDate);
  });
});
