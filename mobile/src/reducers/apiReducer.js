import {
  FETCH_MESSAGE,
  FETCH_MESSAGE_FULFILLED,
  FETCH_MESSAGE_REJECTED, 
} from '../actions/apiActions';

//Define your initialState
const initialState = {
  //Have a people array responsible for getting the data and setting to the array.
  message: null,
  //Have the loading state indicate if it's done getting data.
  loading: true,
  //Have state for error message for recieving an error.
  errorMessage: '',
}


//Define your reducer that will return the initialState by default
const apiReducer = (state = initialState, action) => {
  switch(action.type) {
      case FETCH_MESSAGE: 
        return {...state, loading: true};
      case FETCH_MESSAGE_FULFILLED:
        return {...state, message: action.payload.message, loading: false};
      case FETCH_MESSAGE_REJECTED:
        return {...state, errorMessage: action.payload, loading: false};
      default: 
        return state;
  }
}


export default apiReducer;