import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app";
import { BrowserRouter } from "react-router-dom";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { Provider } from "react-redux";
import rootReducer from "./redux/store";
import firebaseApp from "./service/firebase";
import AuthService from "./service/authService";
import DbService from "./service/dbService";

const store = createStore(rootReducer, applyMiddleware(thunk));
const authService = new AuthService(firebaseApp);
const dbService = new DbService(firebaseApp);

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <React.StrictMode>
        <App authService={authService} dbService={dbService} />
      </React.StrictMode>
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);
