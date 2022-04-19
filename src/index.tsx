import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import "./i18n/config";
import Firebase from "./components/Firebase/firebase";
import FirebaseContext from "./components/Firebase/context";
import ContextProvider from "./hooks/ContextProvider"

ReactDOM.render(
  <FirebaseContext.Provider value={Firebase}>
    <ContextProvider>
      <React.StrictMode>
        <Router>
          <App />
        </Router>
      </React.StrictMode>
    </ContextProvider>
  </FirebaseContext.Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
