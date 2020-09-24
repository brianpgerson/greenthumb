import { createSelector } from 'reselect';

const getAuthState = ({ auth }) => auth;
export const asyncStorageAuthSelector = createSelector(
  getAuthState, 
  ({ asyncStorageAuth }) => asyncStorageAuth,
);

export const validatedAuthSelector = createSelector(
  getAuthState, 
  ({ validatedAuth }) => validatedAuth,
);

export const authErrorSelector = createSelector(
  getAuthState, 
  ({ authError }) => authError,
);
