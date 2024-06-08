import React from 'react';
import ReactDOM from 'react-dom/client'; // updated import for React 18
import './index.css'; // Create a CSS file to include all your styles
import App from './App';

// Create a root.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Initial render: Render an element to the root.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);