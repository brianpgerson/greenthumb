import * as R from 'ramda';
import { DateTime } from 'luxon'

import { LOAD_PLANTS } from '../actions/plantActions';
import { mapWateringDateStringstoLuxon } from '../utils/generalUtils';

const initialState = {
  plants: [],
  streakData: {}
}

const mapPlantToWateringWithName = plants => 
  plants.map(({ name, type, waterings }) =>
    waterings.map(
      R.pipe(
        w => ({ ...w, name, type }),
        mapWateringDateStringstoLuxon,
      )
    ));

const getSortedWaterings = R.pipe(
  mapPlantToWateringWithName,
  R.flatten, 
  R.sortBy(R.path(['startDate', 'ts'])),
);

const drawerReducer = (state = initialState, action) => {
  switch(action.type) {
      case LOAD_PLANTS: 
        const { plants } = action;
        const waterings = getSortedWaterings(plants);
        return {...state, plants: action.plants, streakData: { waterings }};
      default: 
        return state;
  }
}


export default drawerReducer;