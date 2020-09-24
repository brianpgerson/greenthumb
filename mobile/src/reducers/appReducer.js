import {
  SET_APP_LOADING,
  SET_APP_ERROR
} from '../actions/appActions';

const initialState = {
  appLoading: true,
  errorMessage: '',
}

const appReducer = (state = initialState, action) => {
  switch(action.type) {
      case SET_APP_LOADING: 
        return {...state, appLoading: action.loading};
      case SET_APP_ERROR:
        return {...state, errorMessage: action.errorMessage, appLoading: false};
      default: 
        return state;
  }
}


export default appReducer;