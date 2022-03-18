import { combineReducers } from "redux";
import loginReducer from "./authState/loginReducer";
import joinReducer from "./authState/joinReducer";
import loadingReducer from "./loading/reducer";
import boardReducer from "./board/reducer";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

const rootReducer = combineReducers({
  joinReducer,
  loginReducer,
  loadingReducer,
  boardReducer,
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
