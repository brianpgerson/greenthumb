import { createSelector } from 'reselect';
import * as R from 'ramda';
import { DateTime } from 'luxon'

import { getToday, toCalendarDay, isBeforeToday, isBeforeOrSame, isBetween } from '../utils/generalUtils';

const getPlantState = ({ plants }) => plants;

export const allPlantsSelector = createSelector(
  getPlantState, 
  ({ plants }) => plants,
);


export const plantsByIdSelector = createSelector(
  getPlantState, 
  ({ plants }) => R.indexBy(R.prop('id'), plants),
);

export const plantById = (state) => (id) => R.propOr(null, id, plantsByIdSelector(state));

export const allWateringsSelector = createSelector(
  getPlantState,
  R.pathOr([], ['streakData', 'waterings']),
);

const isOverdue = w => w.status !== 'COMPLETE' && isBeforeToday(w.endDate || w.startDate);

const isLate = ({ status, endDate, startDate, wateringDate}) => (status === 'COMPLETE') &&
  (endDate ? !isBeforeOrSame(wateringDate, endDate) : !isBeforeOrSame(wateringDate, startDate));


export const overdueWateringsSelector = createSelector(
  getPlantState,
  R.pipe(
    R.pathOr([], ['streakData', 'waterings']),
    R.filter(isOverdue),
    R.map(R.assoc('overdue', true)),
  )
);

const previousWateringsSelector = createSelector(
  allWateringsSelector,
  waterings => {
    const today = getToday();
    return R.pipe(
      R.reject(({ startDate, endDate, status }) => status !== 'COMPLETE' && isBetween(today, startDate, endDate)),
      R.map(R.pipe(
        R.when(isOverdue, R.assoc('overdue', true)),
        R.when(isLate, R.assoc('late', true)),
      )),
    )(waterings);
  }
)

const getDateKey = ({ startDate, endDate, wateringDate, status, updatedAt }) => {
  if (status === 'PENDING') {
    return toCalendarDay(endDate || startDate);
  } 

  return toCalendarDay(wateringDate);
}

export const previousWateringsByDateSelector = createSelector(
  previousWateringsSelector,
  R.reduce((acc, watering) => {
    const key = getDateKey(watering);
    const wateringsAtDate = acc[key] ? [...acc[key], watering] : [watering];
    return { ...acc, [key]: wateringsAtDate };
  }, {})
)

export const calendarListOfWateringsSelector = createSelector(
  previousWateringsSelector,
  previousWateringsByDateSelector,
  (allPrev, byDate) => {
    let currDate = getToday().minus({ days: 1 })
    let lastDate;

    if (R.isEmpty(allPrev)) {
      lastDate = DateTime.fromISO(currDate.toISODate()).minus({ days: 30 });
    } else {
      lastDate = DateTime.fromISO(allPrev[0].startDate.toISODate())
    }

    const lastDateTime = lastDate.ts;
    const dates = [];

    while (currDate.ts >= lastDateTime) {
      const calDate = toCalendarDay(currDate);
      const dateItem = {
        date: calDate,
        waterings: byDate[calDate] || [],
      }
      dates.push(dateItem);
      
      currDate = currDate.minus({ days: 1 });
    }
    
    return dates;
  }
)

export const dueWateringsSelector = createSelector(
  overdueWateringsSelector,
  allWateringsSelector,
  (overdue, allWaterings) => {
    const today = getToday();
    const todaysWaterings = allWaterings.filter(({ startDate, endDate, wateringDate }) => 
      !wateringDate && isBetween(today, startDate, endDate));
    const doneToday = allWaterings.filter(({ wateringDate }) => 
      wateringDate && wateringDate.diff(today, 'days').days === 0);
    
    return [
      ...overdue, 
      ...todaysWaterings,
      ...doneToday
    ];
  }
);