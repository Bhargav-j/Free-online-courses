import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./Globals/ReduxStore";
import { BrowserRouter as Router } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router basename={"/Free-online-courses"}>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </React.StrictMode>
);
