export const SET_ASYNC_STORAGE_AUTH = 'SET_ASYNC_STORAGE_AUTH';
export const VALIDATE_JWT = 'VALIDATE_JWT';
export const SIGN_OUT = 'SIGN_OUT';
export const COMPLETE_SIGN_IN = 'COMPLETE_SIGN_IN';
export const SET_AUTH_ERROR = 'SET_AUTH_ERROR';

export const setAsyncStorageAuth = ({ accessToken, refreshToken}) => {
  return {
    type: SET_ASYNC_STORAGE_AUTH,
    accessToken,
    refreshToken,
  }
}

export const signOut = (errorMessage) => {
  return {
    type: SIGN_OUT,
    errorMessage
  };
}

export const setCredentials = ({ accessToken, refreshToken}) => {
  return {
    type: COMPLETE_SIGN_IN,
    accessToken,
    refreshToken
  };
}

export const setAuthError = (authError) => {
  return {
    type: SET_AUTH_ERROR,
    authError,
  };
}