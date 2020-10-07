import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import authReducer from './authReducer';
import appReducer from './appReducer';

const reducers = combineReducers({
  auth: authReducer,
  app: appReducer,
});

export const store = createStore(reducers, applyMiddleware(thunk));