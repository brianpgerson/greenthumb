import { createSelector } from 'reselect';

const getAppState = ({ app }) => app;

export const completedInitSelector = createSelector(
  getAppState, 
  ({ completedInit }) => completedInit,
);

export const apiErrorsSelector = createSelector(
  getAppState, 
  ({ apiErrors }) => apiErrors,
);
