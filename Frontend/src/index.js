// index.js
// -----------------------------------------------------------------------------
// Commit: Application root initialization.
// Purpose: 
// - Boots the React application.
// - Injects the global style sheet.
// - Renders the top-level App component into the DOM.
// -----------------------------------------------------------------------------

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Initialize the React Root at the 'root' div
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render in StrictMode for development performance and safety checks
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

