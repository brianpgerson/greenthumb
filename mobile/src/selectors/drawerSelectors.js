import { createSelector } from 'reselect';

const getDrawerState = ({ drawer }) => drawer;

export const activeDrawerScreenSelector = createSelector(
  getDrawerState, 
  ({ activeScreen }) => activeScreen,
);
