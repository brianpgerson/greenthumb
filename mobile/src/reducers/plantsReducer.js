import * as R from 'ramda';

import { LOAD_PLANTS } from '../actions/plantActions';
import { toCalendarDay, isBefore } from '../utils/generalUtils';

const initialState = {
  plants: [],
  streakData: {}
}

const mapPlantToWateringWithName = plants => 
  plants.map(({ name, type, waterings }) => 
    waterings.map(w => ({
        ...w,
        startDate: w.startDate.split('T')[0],
        endDate: w.endDate ? w.endDate.split('T')[0] : w.startDate.split('T')[0],
        updatedAt: w.updatedAt.split('T')[0],
        name,
        type,
      })));

const getSortedWaterings = R.pipe(
  mapPlantToWateringWithName, 
  R.flatten, 
  R.sort((w1, w2) => {
    const sd1 = new Date(w1.startDate).getTime();
    const sd2 = new Date(w2.startDate).getTime();
    const ed1 = new Date(w1.endDate).getTime();
    const ed2 = new Date(w2.endDate).getTime();
    return ed1 === ed2 ? sd2 - sd1 : ed2 - ed1;
  }),
);

// given watering with start date N and end date M, creates M - N waterings with
// a start date for each date between N and M
const expandWaterings = R.pipe(
  R.map(watering => {
    const { startDate, endDate } = watering;
    let d1 = new Date(endDate);
    const d2 = new Date(startDate);

    const expanded = []
    while (d1.getTime() >= d2.getTime()) {
      let w = {
        ...watering,
        date: toCalendarDay(d1)
      };

      expanded.push(w);
      d1 = new Date(d1);
      d1.setDate(d1.getDate() - 1);
    }

    return expanded;
  }),
  R.flatten
);

const indexWateringsByDate = R.reduce((acc, watering) => {
  const { date } = watering;
  const atDate = acc[date] || [];
  return { ...acc, [date]: [...atDate, watering ] }   
}, {})

const setColumnIndices = (wateringsByDate) => {
  const colIdxByWateringID = {};
  return R.mapObjIndexed((waterings, date) => {
    const fullColumnsAtDate = R.pipe(
      R.pluck('id'), 
      R.map(R.propOr(null, R.__, colIdxByWateringID)),
      R.reject(R.isNil),
      columnIndices => new Set([...columnIndices]),
    )(waterings)

    const withIndices = waterings.map(watering => {  
      const { id } = watering;
      const existingCol = colIdxByWateringID[id];
      const shouldStartNewColumn = (existingCol >= 3 && waterings.length <= 3);

      if (existingCol === undefined || shouldStartNewColumn) {
        let newIdx = 0;
        while (fullColumnsAtDate.has(newIdx)) {
          newIdx++
        }
        colIdxByWateringID[id] = newIdx;
        fullColumnsAtDate.add(newIdx);
      }

      return { ...watering, forceStartNewColumn: shouldStartNewColumn, columnIdx: colIdxByWateringID[id] };
    })

    return withIndices;

  }, wateringsByDate)
};

const createWateringList = (waterings = []) => {
  if (waterings.length === 0) {
    return [];
  }

  const wateringsByDate = R.pipe(
    expandWaterings,
    indexWateringsByDate,
    setColumnIndices,
  )(waterings);

  let currDate = new Date(new Date().toISOString().split('T')[0]);
  const lastDateTime = new Date(waterings[waterings.length - 1].startDate).getTime();
  const dates = [];

  while (currDate.getTime() >= lastDateTime) {
    const calDate = toCalendarDay(currDate);
    const dateItem = {
      date: calDate,
      waterings: wateringsByDate[calDate] || [],
    }
    dates.push(dateItem);
    
    currDate = new Date(currDate);
    currDate.setDate(currDate.getDate() - 1);
  }

  return dates;
}

const drawerReducer = (state = initialState, action) => {
  switch(action.type) {
      case LOAD_PLANTS: 
        const { plants } = action;
        const sortedWaterings = getSortedWaterings(plants);
        const waterings = createWateringList(sortedWaterings);
        const overdue = sortedWaterings
          .filter(w => w.status !== 'COMPLETE' && isBefore(w.endDate, new Date()))
          .map(R.assoc('overdue', true));
        return {...state, plants: action.plants, streakData: { waterings, overdue }};
      default: 
        return state;
  }
}


export default drawerReducer;