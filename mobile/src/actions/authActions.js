export const SIGN_OUT = 'SIGN_OUT';
export const COMPLETE_SIGN_IN = 'COMPLETE_SIGN_IN';
export const SET_AUTH_ERROR = 'SET_AUTH_ERROR';
export const START_SIGN_IN = 'START_SIGN_IN';
export const END_SIGN_IN = 'END_SIGN_IN';
export const SET_CHECKED_JWT = 'SET_CHECKED_JWT';


export const startSignIn = () => {
  return {
    type: START_SIGN_IN,
  };
}

export const endSignIn = () => {
  return {
    type: END_SIGN_IN,
  };
}

export const setCheckedJwt = (checkedJWT) => ({
  type: SET_CHECKED_JWT,
  checkedJWT,
});

export const signOut = (errorMessage) => {
  return {
    type: SIGN_OUT,
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