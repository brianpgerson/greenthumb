import {
  SET_APP_LOADING,
  SET_API_ERRORS
} from '../actions/appActions';

const initialState = {
  appLoading: true,
  apiErrors: '',
}

const appReducer = (state = initialState, action) => {
  switch(action.type) {
      case SET_APP_LOADING: 
        return {...state, appLoading: action.loading};
      case SET_API_ERRORS:
        return {...state, apiErrors: action.apiErrors};
      default: 
        return state;
  }
}


export default appReducer;