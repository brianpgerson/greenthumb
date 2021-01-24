import { DateTime } from 'luxon';
import * as R from 'ramda';

export const waitAtLeastASecond = async (ms = 1000) => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('done!');
  }, ms);
});

export const mapWateringDateStringstoLuxon = R.evolve({
  startDate: DateTime.fromISO,
  endDate: endDate => endDate ? DateTime.fromISO(endDate) : null,
  wateringDate: wateringDate => wateringDate ? DateTime.fromISO(wateringDate) : null,
});

export const isBeforeToday = (date) => date.diffNow('days').toObject().days <= -1;

export const isBeforeOrSame = (date1, date2) => {
  return date1.diff(date2, 'days').days <= 0;
}

export const isBefore = (date1, date2) => date1.diff(date2, 'days').days < 0;

export const isBetween = (date, start, end) => {
 return end ? 
  (isBeforeOrSame(start, date) && isBeforeOrSame(date, end)) : 
  start.diff(date, 'days').days === 0;
}

export const toCalendarDay = (date) => date.toLocaleString(DateTime.DATE_MED);

export const getToday = () => DateTime.local().startOf('day');

export const range = (start, end, length = end - start) => Array.from({ length }, (_, i) => start + i);