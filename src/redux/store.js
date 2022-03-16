import { combineReducers } from "redux";
import loginReducer from "./authState/loginReducer";
import joinReducer from "./authState/joinReducer";
import loadingReducer from "./loading/reducer";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
  joinReducer,
  loginReducer,
  loadingReducer,
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
