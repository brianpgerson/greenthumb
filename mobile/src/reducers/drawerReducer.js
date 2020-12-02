import { SET_ACTIVE_SCREEN } from '../actions/drawerActions';

const initialState = {
  activeScreen: null,
}

const drawerReducer = (state = initialState, action) => {
  switch(action.type) {
      case SET_ACTIVE_SCREEN: 
        return {...state, activeScreen: action.activeScreen};
      default: 
        return state;
  }
}


export default drawerReducer;