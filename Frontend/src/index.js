// index.js
// -----------------------------------------------------------------------------
// Commit: Application root initialization.
// Purpose: 
// - Boots the React application.
// - Injects the global style sheet.
// - Renders the top-level App component into the DOM.
// -----------------------------------------------------------------------------

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);


