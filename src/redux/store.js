import { combineReducers } from "redux";
import navigationReducer from "./navigation/reducer";
import authStateReducer from "./authState/reducer";

export default combineReducers({ navigationReducer, authStateReducer });
