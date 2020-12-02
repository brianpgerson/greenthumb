import { createSelector } from 'reselect';

const getAppState = ({ app }) => app;

export const appLoadingSelector = createSelector(
  getAppState, 
  ({ appLoading }) => appLoading,
);

export const apiErrorsSelector = createSelector(
  getAppState, 
  ({ apiErrors }) => apiErrors,
);
