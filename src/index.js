import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

const persistor = persistStore(store);

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </PersistGate>
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);
