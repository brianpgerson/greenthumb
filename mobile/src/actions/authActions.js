export const SET_ASYNC_STORAGE_AUTH = 'SET_ASYNC_STORAGE_AUTH';
export const VALIDATE_JWT = 'VALIDATE_JWT';
export const VALIDATE_JWT_REJECTED = 'VALIDATE_JWT_REJECTED';
export const COMPLETE_SIGN_IN = 'COMPLETE_SIGN_IN';
export const SET_AUTH_ERROR = 'SET_AUTH_ERROR';

export const setAsyncStorageAuth = ({ accessToken, refreshToken}) => {
  return {
    type: SET_ASYNC_STORAGE_AUTH,
    accessToken,
    refreshToken,
  }
}

export const validateJwtRejected = (errorMessage) => {
  return {
    type: VALIDATE_JWT_REJECTED,
    errorMessage
  };
}

export const completeSignIn = ({ accessToken, refreshToken}) => {
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