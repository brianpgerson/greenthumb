import {
  SET_APP_LOADING,
  SET_API_ERRORS,
  SET_COMPLETED_INIT
} from '../actions/appActions';

const initialState = {
  appLoading: true,
  completedInit: false,
  apiErrors: '',
}

const appReducer = (state = initialState, action) => {
  switch(action.type) {
      case SET_COMPLETED_INIT: 
        return {...state, appLoading: false, completedInit: action.completedInit};
      case SET_API_ERRORS:
        return {...state, apiErrors: action.apiErrors};
      default: 
        return state;
  }
}


export default appReducer;