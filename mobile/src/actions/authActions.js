export const SET_ASYNC_STORAGE_AUTH = 'SET_ASYNC_STORAGE_AUTH';
export const VALIDATE_JWT = 'VALIDATE_JWT';
export const VALIDATE_JWT_FULFILLED = 'VALIDATE_JWT_FULFILLED';
export const VALIDATE_JWT_REJECTED = 'VALIDATE_JWT_REJECTED';

export const setAsyncStorageAuth = (asyncStorageAuth) => {
  return {
    type: SET_ASYNC_STORAGE_AUTH,
    asyncStorageAuth
  }
}

export const validateJwtFulfilled = (data) => {
  return {
    type: VALIDATE_JWT_FULFILLED,
    data,
  };
}

export const validateJwtRejected = (errorMessage) => {
  return {
    type: VALIDATE_JWT_REJECTED,
    errorMessage
  };
}