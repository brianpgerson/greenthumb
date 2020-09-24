import {
  SET_ASYNC_STORAGE_AUTH,
  VALIDATE_JWT,
  VALIDATE_JWT_FULFILLED,
  VALIDATE_JWT_REJECTED, 
} from '../actions/authActions';

const initialState = {
  asyncStorageAuth: null,
  validatedAuth: null,
  authError: null,
}

const authReducer = (state = initialState, action) => {
  switch(action.type) {
      case VALIDATE_JWT_FULFILLED:
        return {...state, validatedAuth: action.accessToken };
      case VALIDATE_JWT_REJECTED:
        return {...state, authError: action.authError };
      case SET_ASYNC_STORAGE_AUTH:
        return {...state, asyncStorageAuth: action.asyncStorageAuth };
      default: 
        return state;
  }
}


export default authReducer;