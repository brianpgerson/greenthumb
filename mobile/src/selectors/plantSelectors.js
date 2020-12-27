import { createSelector } from 'reselect';
import * as R from 'ramda';

const getPlantState = ({ plants }) => plants;

export const allPlantsSelector = createSelector(
  getPlantState, 
  ({ plants }) => plants,
);

const mapPlantToWateringWithName = plants => 
  plants.map(({ name, type, waterings }) => 
    waterings.map(w => ({
        ...w,
        startDate: w.startDate.split('T')[0],
        endDate: w.endDate.split('T')[0],
        updatedAt: w.updatedAt.split('T')[0],
        name,
        type,
      })));

export const allWateringsSelector = createSelector(
  getPlantState,
  R.pathOr([], ['streakData', 'waterings']),
);

export const overdueWateringsSelector = createSelector(
  getPlantState,
  R.pathOr([], ['streakData', 'overdue']),
);