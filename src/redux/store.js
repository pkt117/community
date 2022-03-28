import { combineReducers } from "redux";
import loginReducer from "./authState/loginReducer";
import joinReducer from "./authState/joinReducer";
import loadingReducer from "./loading/reducer";
import boardReducer from "./board/reducer";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["loginReducer"],
};

const rootReducer = combineReducers({
  joinReducer,
  loginReducer,
  loadingReducer,
  boardReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
