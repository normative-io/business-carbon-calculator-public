import { DateTime } from 'luxon';

import { TimePeriod } from '../../wizard/ngxs/wizard.model';

export const LUXON_DATE_FORMAT = 'd LLLL yyyy'; // 1 January 2022
export const LUXON_DATE_FORMAT_SHORT = 'd LLL yyyy'; // 1 Jan 2022

export function formatTimePeriod(timePeriod: TimePeriod, join = '-', format = LUXON_DATE_FORMAT): string {
  const startDate = DateTime.fromISO(timePeriod.startDate, { zone: 'utc' }).setLocale('en');
  const endDate = DateTime.fromISO(timePeriod.endDate, { zone: 'utc' }).setLocale('en');

  return startDate.isValid && endDate.isValid
    ? `${startDate.toFormat(format)} ${join} ${endDate.toFormat(format)}`
    : '';
}

/** Ensures the returned value is a DateTime object. */
export function getDateTime(value: DateTime | string): DateTime {
  return value instanceof DateTime ? value : DateTime.fromISO(value, { zone: 'utc' });
}
