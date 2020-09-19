import {combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import apiReducer from './apiReducer';

const reducers = combineReducers({
  api: apiReducer
});

export const store = createStore(reducers, applyMiddleware(thunk));