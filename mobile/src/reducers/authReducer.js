import {
  SET_ASYNC_STORAGE_AUTH,
  VALIDATE_JWT,
  SIGN_OUT, 
  SET_AUTH_ERROR,
  COMPLETE_SIGN_IN,
  START_SIGN_IN,
  END_SIGN_IN,
  SET_CHECKED_JWT,
} from '../actions/authActions';

const initialState = {
  signingIn: false,
  checkedJWT: false,
  asyncStorageAuth: {
    accessToken: null,
    refreshToken: null,
  },
  validAccessToken: null,
  validRefreshToken: null,
  authError: null,
}

const authReducer = (state = initialState, action) => {
  switch(action.type) {
    case START_SIGN_IN:
      return { ...state, signingIn: true };
    case END_SIGN_IN:
      return { ...state, signingIn: false };
    case SET_CHECKED_JWT:
      return { ...state, checkedJWT: action.checkedJWT };
    case SET_ASYNC_STORAGE_AUTH:
      return {
        ...state, 
        asyncStorageAuth: {
          accessToken: action.accessToken,
          refreshToken: action.refreshToken,
        } 
      };
    case SET_AUTH_ERROR: 
      return {...state, authError: action.authError };
    case COMPLETE_SIGN_IN:
      return {...state, signingIn: false, validAccessToken: action.accessToken, validRefreshToken: action.refreshToken, authError:  null };
    case SIGN_OUT:
      return {...state, validAccessToken: null, validRefreshToken: null, authError: action.authError };
    default: 
      return state;
  }
}


export default authReducer;