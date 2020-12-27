import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import authReducer from './authReducer';
import appReducer from './appReducer';
import drawerReducer from './drawerReducer'
import plantsReducer from './plantsReducer'

const reducers = combineReducers({
  auth: authReducer,
  app: appReducer,
  drawer: drawerReducer,
  plants: plantsReducer,
});

export const store = createStore(reducers, applyMiddleware(thunk));