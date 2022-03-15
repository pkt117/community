import { combineReducers } from "redux";
import authStateReducer from "./authState/reducer";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

const rootReducer = combineReducers({ authStateReducer });

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
