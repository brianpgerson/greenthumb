import { createSelector } from 'reselect';

const getAuthState = ({ auth }) => auth;
export const asyncStorageAuthSelector = createSelector(
  getAuthState, 
  ({ asyncStorageAuth }) => asyncStorageAuth,
);

export const validAccessTokenSelector = createSelector(
  getAuthState, 
  ({ validAccessToken }) => validAccessToken,
);

export const validRefreshTokenSelector = createSelector(
  getAuthState, 
  ({ validRefreshToken }) => validRefreshToken,
);

export const authErrorSelector = createSelector(
  getAuthState, 
  ({ authError }) => authError,
);
