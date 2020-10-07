import {
  SET_ASYNC_STORAGE_AUTH,
  VALIDATE_JWT,
  VALIDATE_JWT_REJECTED, 
  SET_AUTH_ERROR,
  COMPLETE_SIGN_IN,
} from '../actions/authActions';

const initialState = {
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
      case VALIDATE_JWT_REJECTED:
        return {...state, validAccessToken: null, authError: action.authError };
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
        return {...state, validAccessToken: action.accessToken, validRefreshToken: action.refreshToken, authError:  null };
      default: 
        return state;
  }
}


export default authReducer;