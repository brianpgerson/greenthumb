import { createSelector } from 'reselect';

const getAppState = ({ app }) => app;

export const appLoadingSelector = createSelector(
  getAppState, 
  ({ appLoading }) => appLoading,
);

export const appErrorMessageSelector = createSelector(
  getAppState, 
  ({ errorMessage }) => errorMessage,
);
